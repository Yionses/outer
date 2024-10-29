import { useMutation } from "react-query"
import { get, post } from "."

export function fetchUploadData() {
  return useMutation((data: any) => post("/data/upload", data))
}
