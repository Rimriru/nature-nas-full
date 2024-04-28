type Placement = 'home-1' | 'home-2';

interface Slide {
  _id: string;
  img: string;
  content: string;
  placement: Placement;
}

export default Slide;
