export interface Invitation {
  id: number;
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  locationName: string;
  locationAddress: string;
  coverImage: string;
  galleryImages: string[];
  blessingText: string;
}
