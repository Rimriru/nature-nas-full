import canvasOne from '~/assets/images/canvas-1.png';
import canvasTwo from '~/assets/images/canvas-2.png';
import canvasThree from '~/assets/images/canvas-3.png';
import canvasFour from '~/assets/images/canvas-4.png';
import canvasFive from '~/assets/images/canvas-5.png';
import canvasSix from '~/assets/images/canvas-6.png';

import { CanvasOne, CanvasTwo, CanvasThree, CanvasFour, CanvasFive, CanvasSix } from '#components';
import type { DefineComponent } from 'vue';

interface Canvases {
  [key: string]: DefineComponent;
}

export const CANVAS_OPTIONS = [
  {
    value: 'CanvasOne',
    img: canvasOne,
    tooltipText: 'Контакт, описание, текст, галерея, секции'
  },
  {
    value: 'CanvasTwo',
    img: canvasTwo,
    tooltipText: 'Описание, контакт, текст, галерея, секции'
  },
  {
    value: 'CanvasThree',
    img: canvasThree,
    tooltipText: 'Контакт (2), описание, текст, галерея, секции'
  },
  {
    value: 'CanvasFour',
    img: canvasFour,
    tooltipText: 'Галерея, текст, контакт (2), описание, секции'
  },
  {
    value: 'CanvasFive',
    img: canvasFive,
    tooltipText: 'Галерея, текст, секции'
  },
  {
    value: 'CanvasSix',
    img: canvasSix,
    tooltipText: 'Текст, галерея, текст, секции'
  }
];

export const canvases: Canvases = {
  CanvasOne: CanvasOne as DefineComponent,
  CanvasTwo: CanvasTwo as DefineComponent,
  CanvasThree: CanvasThree as DefineComponent,
  CanvasFour: CanvasFour as DefineComponent,
  CanvasFive: CanvasFive as DefineComponent,
  CanvasSix: CanvasSix as DefineComponent
};
