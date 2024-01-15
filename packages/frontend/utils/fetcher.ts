import { notifications } from "@mantine/notifications"
import { sign } from "crypto"
import Router from "next/router"
import { signOut } from "./auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

function buildUrl(path: string) {
  if (path.includes("/auth")) {
    return `${BASE_URL}${path}`
  }
  return `${BASE_URL}/v1${path}`
}

function get(path) {
  return fetch(buildUrl(path), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
    },
  }).then(handleResponse)
}

function post(path, { arg }) {
  return fetch(buildUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
    },
    body: JSON.stringify(arg),
  }).then(handleResponse)
}

function patch(path, { arg }) {
  return fetch(buildUrl(path), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
    },
    body: JSON.stringify(arg),
  }).then(handleResponse)
}

async function del(path) {
  return fetch(buildUrl(path), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
    },
  }).then(handleResponse)
}

async function handleResponse(res: Response) {
  const contentType = res.headers.get("Content-Type")
  const isJson = contentType?.includes("application/json")

  if (!res.ok) {
    if (res.status === 401) {
      // signOut()
    }
    if (isJson) {
      const { error, message } = await res.json()

      notifications.show({
        title: error || "Unknown error",
        message: message || "Something went wrong",
        color: "red",
        autoClose: 10000,
      })

      throw new Error(message)
    }
  }

  if (isJson) {
    return res.json()
  }
  return res.text()
}

export const fetcher = {
  get,
  post,
  patch,
  delete: del,
}
