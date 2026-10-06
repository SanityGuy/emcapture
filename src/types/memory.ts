export type MemoryRating = 1 | 2 | 3 | 4 | 5

export interface Memory {
  id: string
  name: string
  imageUri: string
  rating: MemoryRating
  description?: string
  createdAt: number
}