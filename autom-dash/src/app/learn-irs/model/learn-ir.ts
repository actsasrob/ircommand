
export interface LearnIR {
  id: number;
  seqNo:number;
  url:string;
  iconUrl: string;
  learnIRListIcon: string;
  description: string;
  longDescription?: string;
  category: string;
  lessonsCount: number;
  promo: boolean;
}


export function compareLearnIRs(c1:LearnIR, c2: LearnIR) {

  const compare = c1.seqNo - c2.seqNo;

  if (compare > 0) {
    return 1;
  }
  else if ( compare < 0) {
    return -1;
  }
  else return 0;

}
