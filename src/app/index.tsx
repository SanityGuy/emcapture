import { Text, View } from "react-native"

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-4xl font-extrabold text-blue-500">
        EmCapture
      </Text>

      <Text className="mt-2 font-bold text-blue-500">
        Memorable moments, captured effortlessly.
      </Text>
    </View>
  )
}