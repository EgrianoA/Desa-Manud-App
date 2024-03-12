import { CCarousel, CCarouselItem, CCarouselCaption, CImage } from '@coreui/react';
import { Button } from 'antd'
import styled from 'styled-components'
import { useRouter } from 'next/router';

const CarouselContainer = styled.div`
   .carousel{
      width:100vw;
      height:60vh;
      img{
         height:60vh;
         width:100vw;
         object-fit: cover;
         filter: brightness(80%);
      }
   }

   h5 {
    -webkit-text-stroke: 1px grey;
    font-size: 35px;
   }
`

type CarouselContent = {
    image: string,
    title: string,
    slugname: string,
    alt: string,
}

const Carousel = ({ carouselData }: CarouselContent[]) => {
    const router = useRouter();

    return (
        <CarouselContainer>
            <CCarousel controls indicators>
                {carouselData.map((data) => (
                    <CCarouselItem key={data.title}>
                        <CImage src={data.image} alt={data.alt} />
                        <CCarouselCaption className="d-none d-md-block" style={{ marginBottom: '30px' }}>
                            <h5>{data.title}</h5>
                            <Button type='primary' onClick={() => router.push(`/artikel/${data.slugname}`)}>Baca Selengkapnya</Button>
                        </CCarouselCaption>
                    </CCarouselItem>
                ))}
            </CCarousel>
        </CarouselContainer>)
}

export default Carousel