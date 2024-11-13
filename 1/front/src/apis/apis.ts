import { useMutation } from "react-query"
import { get, post } from "."

export function fetchUploadData() {
  return useMutation((data: any) => post("/data/upload", data))
}

export function fetchUploadOuterData() {
  return useMutation((data: any) => post("/data/outerUpload", data))
}

export function fetchMaterial() {
  return useMutation(() => get("/data/material"))
}

export function fetchSpecifications() {
  return useMutation((data) => post("/data/specifications", data))
}
