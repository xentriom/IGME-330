import { Track } from './track.interface';
import { DrawParams } from './drawParams.interface';

export interface AVData {
    title: string;
    drawParams: DrawParams;
    data: Track[];
}