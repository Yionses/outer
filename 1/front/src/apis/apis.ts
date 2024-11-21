import { useMutation } from "react-query"
import { get, post } from "."

export function fetchUploadData() {
  return useMutation(async (data: any) => post("/data/upload", data))
}

export function fetchUploadOuterData() {
  return useMutation(async (data: any) => post("/data/outerUpload", data))
}

export function fetchMaterial() {
  return useMutation(async () => get("/data/material"))
}

export function fetchSpecifications() {
  return useMutation(async (data) => post("/data/specifications", data))
}

export function fetchDataDetail() {
  return useMutation(async (data) => post("/data/data", data))
}
