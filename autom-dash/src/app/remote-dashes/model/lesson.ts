

export interface Lesson {
    id: number;
    description: string;
    duration: string;
    seqNo: number;
    remoteDashId: number;
}


export function compareLessons(l1:Lesson, l2: Lesson) {

  const compareRemoteDashes = l1.remoteDashId - l2.remoteDashId;

  if (compareRemoteDashes > 0) {
    return 1;
  }
  else if (compareRemoteDashes < 0){
    return -1;
  }
  else {
    return l1.seqNo - l2.seqNo;
  }

}
