import AsyncStorage from "@react-native-async-storage/async-storage"
import * as FileSystem from "expo-file-system/legacy"
import type { Memory, MemoryRating } from "@/types/memory"

const MEMORY_KEY = "emcapture_memories"

export async function getMemories(): Promise<Memory[]> {
  const data = await AsyncStorage.getItem(MEMORY_KEY)

  if (!data) {
    return []
  }

  return JSON.parse(data)
}

export async function saveMemory(memory: Memory): Promise<void> {
  const memories = await getMemories()

  await AsyncStorage.setItem(
    MEMORY_KEY,
    JSON.stringify([memory, ...memories]),
  )
}

export async function updateMemory(
  id: string,
  name: string,
  rating: MemoryRating,
  description?: string,
): Promise<void> {
  const memories = await getMemories()

  const updated = memories.map((memory) =>
    memory.id === id
      ? {
          ...memory,
          name,
          rating,
          description,
        }
      : memory,
  )

  await AsyncStorage.setItem(MEMORY_KEY, JSON.stringify(updated))
}

export async function deleteMemory(id: string): Promise<void> {
  const memories = await getMemories()
  const memory = memories.find((item) => item.id === id)

  if (!memory) {
    return
  }

  try {
    await FileSystem.deleteAsync(memory.imageUri, {
      idempotent: true,
    })
  } catch {
    // Image may already be missing.
  }

  const updated = memories.filter((item) => item.id !== id)

  await AsyncStorage.setItem(MEMORY_KEY, JSON.stringify(updated))
}

export async function saveImage(
  sourceUri: string,
  id: string,
): Promise<string> {
  const directory = `${FileSystem.documentDirectory}memories/`

  const directoryInfo = await FileSystem.getInfoAsync(directory)

  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(directory, {
      intermediates: true,
    })
  }

  const destination = `${directory}${id}.jpg`

  await FileSystem.copyAsync({
    from: sourceUri,
    to: destination,
  })

  return destination
}