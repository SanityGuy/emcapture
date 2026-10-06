import { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native"
import { styled } from "nativewind";
import { SafeAreaView as BaseSafeAreaView } from "react-native-safe-area-context"
import * as ImagePicker from "expo-image-picker"
import MemoryCard from "@/components/MemoryCard"
import MemoryEditor from "@/components/MemoryEditor"
import {
  deleteMemory,
  getMemories,
  saveImage,
  saveMemory,
  updateMemory,
} from "@/lib/storage"
import type { Memory, MemoryRating } from "@/types/memory"

const SafeAreaView = styled(BaseSafeAreaView)

export default function HomeScreen() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [editorVisible, setEditorVisible] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [selectedImageUri, setSelectedImageUri] = useState("")

  const loadMemories = useCallback(async () => {
    try {
      const data = await getMemories()
      setMemories(data)
    } catch {
      Alert.alert(
        "Couldn't load memories",
        "Something went wrong while loading your memories.",
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMemories()
  }, [loadMemories])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadMemories()
    setRefreshing(false)
  }

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permission.granted) {
      Alert.alert(
        "Photo permission needed",
        "EmCapture needs access to your photos so you can save memories.",
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    })

    if (result.canceled || !result.assets[0]) {
      return
    }

    setSelectedMemory(null)
    setSelectedImageUri(result.assets[0].uri)
    setEditorVisible(true)
  }

  const handleEdit = (memory: Memory) => {
    setSelectedMemory(memory)
    setSelectedImageUri(memory.imageUri)
    setEditorVisible(true)
  }

  const handleSave = async (
    name: string,
    rating: MemoryRating,
    description?: string,
  ) => {
    try {
      if (selectedMemory) {
        await updateMemory(
          selectedMemory.id,
          name,
          rating,
          description,
        )
      } else {
        const id = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`

        const imageUri = await saveImage(selectedImageUri, id)

        const memory: Memory = {
          id,
          name,
          imageUri,
          rating,
          description,
          createdAt: Date.now(),
        }

        await saveMemory(memory)
      }

      setEditorVisible(false)
      setSelectedMemory(null)
      setSelectedImageUri("")

      await loadMemories()
    } catch {
      Alert.alert(
        "Couldn't save memory",
        "Something went wrong while saving this memory.",
      )
    }
  }

  const handleDelete = async () => {
    if (!selectedMemory) {
      return
    }

    try {
      await deleteMemory(selectedMemory.id)

      setEditorVisible(false)
      setSelectedMemory(null)
      setSelectedImageUri("")

      await loadMemories()
    } catch {
      Alert.alert(
        "Couldn't delete memory",
        "Something went wrong while deleting this memory.",
      )
    }
  }

  const closeEditor = () => {
    setEditorVisible(false)
    setSelectedMemory(null)
    setSelectedImageUri("")
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
          <View>
            <Text className="text-3xl font-bold text-white">
              EmCapture
            </Text>

            <Text className="mt-1 text-sm text-zinc-500">
              Your memories, kept locally.
            </Text>
          </View>

          <Pressable
            onPress={pickImage}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 active:bg-blue-700"
          >
            <Text className="text-2xl font-light text-white">+</Text>
          </Pressable>
        </View>

        {memories.length === 0 ? (
          <View className="flex-1 items-center justify-center px-10 pb-20">
            <View className="mb-5 h-20 w-20 items-center justify-center rounded-3xl bg-blue-600/10">
              <Text className="text-4xl">📸</Text>
            </View>

            <Text className="text-center text-xl font-bold text-white">
              No memories yet
            </Text>

            <Text className="mt-2 text-center leading-5 text-zinc-500">
              Capture your first memory and it'll stay safely on this device.
            </Text>

            <Pressable
              onPress={pickImage}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3.5 active:bg-blue-700"
            >
              <Text className="font-bold text-white">
                Add Your First Memory
              </Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={memories}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{
              gap: 12,
              paddingHorizontal: 16,
            }}
            contentContainerStyle={{
              gap: 12,
              paddingBottom: 24,
            }}
            renderItem={({ item }) => (
              <View className="flex-1">
                <MemoryCard
                  memory={item}
                  onPress={() => handleEdit(item)}
                />
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#2563eb"
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        <MemoryEditor
          visible={editorVisible}
          imageUri={selectedImageUri}
          memory={selectedMemory}
          onSave={handleSave}
          onDelete={selectedMemory ? handleDelete : undefined}
          onClose={closeEditor}
        />
      </View>
    </SafeAreaView>
  )
}