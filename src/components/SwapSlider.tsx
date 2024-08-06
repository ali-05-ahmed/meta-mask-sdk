import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext
} from "@/components/ui/carousel";

export default function SwapSlider({
  children,
}: {
  children: React.ReactNode[];
}) {
  return (
    <Carousel>
      <CarouselContent>
        {children.map((child, index) => (
          <CarouselItem key={index}>{child}</CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
