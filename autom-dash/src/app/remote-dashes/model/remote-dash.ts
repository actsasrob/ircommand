
export interface RemoteDash {
  id: number;
  seqNo:number;
  layout:string;
  userId: number;
}


export function compareRemoteDashes(c1:RemoteDash, c2: RemoteDash) {

  const compare = c1.seqNo - c2.seqNo;

  if (compare > 0) {
    return 1;
  }
  else if ( compare < 0) {
    return -1;
  }
  else return 0;

}
