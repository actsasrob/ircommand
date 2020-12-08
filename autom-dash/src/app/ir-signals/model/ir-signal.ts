
export interface IRSignal {
  id: number;
  seqNo:number;
  name:string;
  signal:string;
  iconUrl: string;
  alexaIntent: string;
  alexaAction: string;
  alexaComponent: string;
  alexaToggle: boolean;
  userId: number;
}


export function compareIRSignals(c1:IRSignal, c2: IRSignal) {

  const compare = c1.seqNo - c2.seqNo;

  if (compare > 0) {
    return 1;
  }
  else if ( compare < 0) {
    return -1;
  }
  else return 0;

}
