import { db } from '@/app/lib/db';

export interface HeroSlide {
  id: string;
  title: string;
  titleFa: string;
  description?: string | null;
  descriptionFa?: string | null;
  imageUrl: string;
  buttonOneText?: string | null;
  buttonOneFa?: string | null;
  buttonOneLink?: string | null;
  buttonTwoText?: string | null;
  buttonTwoFa?: string | null;
  buttonTwoLink?: string | null;
  isActive: boolean;
  orderIndex: number;
}

/**
 * Fetches active hero slides from the database, ordered by their orderIndex
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const heroSlides = await db.heroSlide.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });
    
    return heroSlides;
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
}

/**
 * Fetches a single hero slide by its ID
 */
export async function getHeroSlideById(id: string): Promise<HeroSlide | null> {
  try {
    const heroSlide = await db.heroSlide.findUnique({
      where: {
        id
      }
    });
    
    return heroSlide;
  } catch (error) {
    console.error(`Error fetching hero slide with ID ${id}:`, error);
    return null;
  }
} 