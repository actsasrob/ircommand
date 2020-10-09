

export interface Lesson {
    id: number;
    description: string;
    duration: string;
    seqNo: number;
    learnIRId: number;
}


export function compareLessons(l1:Lesson, l2: Lesson) {

  const compareLearnIRs = l1.learnIRId - l2.learnIRId;

  if (compareLearnIRs > 0) {
    return 1;
  }
  else if (compareLearnIRs < 0){
    return -1;
  }
  else {
    return l1.seqNo - l2.seqNo;
  }

}
