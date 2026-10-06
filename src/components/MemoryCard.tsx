import { Image, Pressable, Text, View } from "react-native"
import type { Memory } from "@/types/memory"

interface MemoryCardProps {
  memory: Memory
  onPress?: () => void
  preview?: boolean
}

export default function MemoryCard({
  memory,
  onPress,
  preview = false,
}: MemoryCardProps) {
  const date = new Date(memory.createdAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const content = (
    <View className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <Image
        source={{ uri: memory.imageUri }}
        className={preview ? "h-52 w-full" : "h-44 w-full"}
        resizeMode="cover"
      />

      <View className="gap-2 p-3">
        <Text
          className="text-base font-bold text-white"
          numberOfLines={1}
        >
          {memory.name || "Untitled memory"}
        </Text>

        <Text className="text-xs text-zinc-500">{date}</Text>

        <View className="flex-row items-center gap-1">
          <Text className="text-sm text-blue-500">
            {"★".repeat(memory.rating)}
          </Text>

          <Text className="ml-1 text-xs text-zinc-500">
            {memory.rating}/5
          </Text>
        </View>

        {memory.description?.trim() ? (
          <Text
            className="text-sm leading-5 text-zinc-400"
            numberOfLines={3}
          >
            {memory.description}
          </Text>
        ) : null}
      </View>
    </View>
  )

  if (!onPress) {
    return content
  }

  return (
    <Pressable
      onPress={onPress}
      className="active:opacity-80"
    >
      {content}
    </Pressable>
  )
}