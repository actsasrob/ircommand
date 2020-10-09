
export interface Course {
  id: number;
  seqNo:number;
  url:string;
  iconUrl: string;
  description: string;
  longDescription?: string;
  category: string;
  promo: boolean;
}


export function compareCourses(c1:Course, c2: Course) {

  const compare = c1.seqNo - c2.seqNo;

  if (compare > 0) {
    return 1;
  }
  else if ( compare < 0) {
    return -1;
  }
  else return 0;

}
