export interface SliderConfig { 
    sliderId: string; 
    labelId: string; 
    unit: string; 
    setValueCallback: (value: number) => void; 
}