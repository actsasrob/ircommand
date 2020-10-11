
export interface IRSignal {
  id: number;
  seqNo:number;
  name:string;
  signal:string;
  iconUrl: string;
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
