import { Pressable, Text, View } from "react-native"
import type { MemoryRating } from "@/types/memory"

interface RatingSelectorProps {
  value: MemoryRating
  onChange: (rating: MemoryRating) => void
}

export default function RatingSelector({
  value,
  onChange,
}: RatingSelectorProps) {
  return (
    <View className="gap-3">
      <Text className="text-sm font-semibold text-white">Rating</Text>

      <View className="flex-row items-center gap-2">
        {[1, 2, 3, 4, 5].map((rating) => {
          const selected = rating <= value

          return (
            <Pressable
              key={rating}
              onPress={() => onChange(rating as MemoryRating)}
              className="h-11 w-11 items-center justify-center rounded-xl bg-zinc-900"
            >
              <Text
                className={`text-2xl ${
                  selected ? "text-blue-500" : "text-zinc-600"
                }`}
              >
                ★
              </Text>
            </Pressable>
          )
        })}
      </View>

      <Text className="text-xs text-zinc-500">
        {value} out of 5 stars
      </Text>
    </View>
  )
}