interface ArrayId {
  id: number;
}

export function arrayRemoveById(arr: any[], id: number) {
  return arr.filter(function(ele) {
    return ele.id !== id;
  });
}

export function arrayFindById(arr: ArrayId[], id: number) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return i;
    }
  }
  return -1;
}
