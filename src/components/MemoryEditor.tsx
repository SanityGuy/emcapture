import { useEffect, useMemo, useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native"
import type { Memory, MemoryRating } from "@/types/memory"
import RatingSelector from "./RatingSelector"
import MemoryCard from "./MemoryCard"

interface MemoryEditorProps {
  visible: boolean
  imageUri: string
  memory?: Memory | null
  onSave: (
    name: string,
    rating: MemoryRating,
    description?: string,
  ) => void
  onDelete?: () => void
  onClose: () => void
}

export default function MemoryEditor({
  visible,
  imageUri,
  memory,
  onSave,
  onDelete,
  onClose,
}: MemoryEditorProps) {
  const [name, setName] = useState("")
  const [rating, setRating] = useState<MemoryRating>(5)
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (!visible) {
      return
    }

    setName(memory?.name ?? "")
    setRating(memory?.rating ?? 5)
    setDescription(memory?.description ?? "")
  }, [visible, memory])

  const previewMemory = useMemo<Memory>(
    () => ({
      id: memory?.id ?? "preview",
      name: name.trim() || "Untitled memory",
      imageUri,
      rating,
      description: description.trim() || undefined,
      createdAt: memory?.createdAt ?? Date.now(),
    }),
    [memory, imageUri, name, rating, description],
  )

  const handleSave = () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      Alert.alert("Missing title", "Give this memory a title first.")
      return
    }

    onSave(
      trimmedName,
      rating,
      description.trim() || undefined,
    )
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete memory?",
      "This will permanently remove the memory and its photo.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ],
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="flex-row items-center justify-between border-b border-zinc-900 px-5 py-4">
            <Pressable onPress={onClose}>
              <Text className="text-base text-zinc-400">Cancel</Text>
            </Pressable>

            <Text className="text-lg font-bold text-white">
              {memory ? "Edit Memory" : "New Memory"}
            </Text>

            <Pressable onPress={handleSave}>
              <Text className="text-base font-bold text-blue-500">
                Save
              </Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 20, gap: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-3">
              <Text className="text-sm font-semibold text-white">
                Preview
              </Text>

              <MemoryCard memory={previewMemory} preview />
            </View>

            <View className="gap-3">
              <Text className="text-sm font-semibold text-white">
                Title
              </Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Give this memory a name"
                placeholderTextColor="#71717a"
                maxLength={80}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white"
              />
            </View>

            <RatingSelector
              value={rating}
              onChange={setRating}
            />

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-white">
                  Description
                </Text>

                <Text className="text-xs text-zinc-600">
                  Optional
                </Text>
              </View>

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Add a note about this memory..."
                placeholderTextColor="#71717a"
                maxLength={300}
                multiline
                textAlignVertical="top"
                className="min-h-28 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base leading-5 text-white"
              />

              <Text className="text-right text-xs text-zinc-600">
                {description.length}/300
              </Text>
            </View>

            {memory && onDelete ? (
              <Pressable
                onPress={handleDelete}
                className="mt-2 items-center rounded-xl border border-red-950 bg-red-950/30 py-4"
              >
                <Text className="font-semibold text-red-400">
                  Delete Memory
                </Text>
              </Pressable>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}