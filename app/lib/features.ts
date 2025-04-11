import { db } from '@/app/lib/db';
import { FeatureItem } from '@prisma/client';

/**
 * Get all active feature items, sorted by order index
 */
export async function getFeatureItems(): Promise<FeatureItem[]> {
  try {
    const features = await db.featureItem.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });
    
    return features;
  } catch (error) {
    console.error('Error fetching feature items:', error);
    return [];
  }
}

/**
 * Get a specific feature item by ID
 */
export async function getFeatureItemById(id: string): Promise<FeatureItem | null> {
  try {
    const feature = await db.featureItem.findUnique({
      where: {
        id
      }
    });
    
    return feature;
  } catch (error) {
    console.error(`Error fetching feature item with ID ${id}:`, error);
    return null;
  }
}

/**
 * Create a new feature item
 */
export async function createFeatureItem(
  data: {
    title: string;
    titleFa: string;
    description: string;
    descriptionFa: string;
    iconName: string;
    orderIndex: number;
    isActive: boolean;
    adminId: string;
  }
): Promise<FeatureItem> {
  return await db.featureItem.create({
    data
  });
}

/**
 * Update an existing feature item
 */
export async function updateFeatureItem(
  id: string,
  data: {
    title?: string;
    titleFa?: string;
    description?: string;
    descriptionFa?: string;
    iconName?: string;
    orderIndex?: number;
    isActive?: boolean;
  }
): Promise<FeatureItem> {
  return await db.featureItem.update({
    where: { id },
    data
  });
}

/**
 * Delete a feature item
 */
export async function deleteFeatureItem(id: string): Promise<FeatureItem> {
  return await db.featureItem.delete({
    where: { id }
  });
}

/**
 * Get the maximum order index of all feature items
 */
export async function getMaxFeatureOrderIndex(): Promise<number> {
  const maxOrderItem = await db.featureItem.findFirst({
    orderBy: {
      orderIndex: 'desc'
    }
  });
  
  return maxOrderItem ? maxOrderItem.orderIndex : -1;
} 