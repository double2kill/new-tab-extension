const DB_NAME = 'ThumbnailCacheDB'
const DB_STORE_NAME = 'thumbnails'
const DB_VERSION = 1

// 初始化 IndexedDB
export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = function (event) {
      const db = event.target.result
      if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
        db.createObjectStore(DB_STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = function (event) {
      resolve(event.target.result)
    }

    request.onerror = function (event) {
      reject(event.target.error)
    }
  })
}

// 存储缩略图
export async function storeThumbnail(id: string, thumbnailData: string): Promise<string> {
  const db = await initDB()
  const transaction = db.transaction(DB_STORE_NAME, 'readwrite')
  const store = transaction.objectStore(DB_STORE_NAME)

  store.put({ id, thumbnailData })

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve('')
    transaction.onerror = (event) => reject(event.target.error)
  })
}

// 获取缩略图
export async function getThumbnail(id: string): Promise<string> {
  const db = await initDB()
  const transaction = db.transaction(DB_STORE_NAME, 'readonly')
  const store = transaction.objectStore(DB_STORE_NAME)

  return new Promise((resolve, reject) => {
    const request = store.get(id)
    request.onsuccess = () => resolve(request.result?.thumbnailData || '')
    request.onerror = (event) => reject(event.target.error)
  })
}

// 创建缩略图
export function createThumbnail(imageUrl: string, width = 350, height = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/png'))
    }

    img.onerror = (event) => reject(event)
    img.src = imageUrl
  })
}

// 使用缩略图缓存
export async function loadImage(imageUrl: string, width = 350, height = 200): Promise<string> {
  const imageUrlKey = [imageUrl, width, height].join('_')
  const cachedThumbnail = await getThumbnail(imageUrlKey)
  if (cachedThumbnail) {
    return cachedThumbnail
  }

  const thumbnailData = await createThumbnail(imageUrl, width, height)
  await storeThumbnail(imageUrlKey, thumbnailData)
  return thumbnailData
}
