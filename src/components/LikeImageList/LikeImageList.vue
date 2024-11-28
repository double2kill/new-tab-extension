<script setup lang="ts">
import { Heart, HeartOutline, ReloadOutline, TrashOutline } from '@vicons/ionicons5'
import dayjs from 'dayjs'
import {
  NButton,
  NCard,
  NCheckbox,
  NDrawer,
  NDrawerContent,
  NIcon,
  NSpace,
  NTooltip
} from 'naive-ui'
import { onMounted, ref, toRaw } from 'vue'
import { useLocalStorageState } from 'vue-hooks-plus'

import { loadImage } from './thumbnailStore'

const props = defineProps<{
  bgImgSrc: string | undefined
  setBgImgSrc: (src: string) => void
}>()

type ListItem = { url: string; thumbnailData?: string }

const [linkList, setLinkList] = useLocalStorageState<string[]>('new-tab.list', {
  defaultValue: []
})
const [fetchDate, setFetchDate] = useLocalStorageState('new-tab.fetch-background-image-date', {
  defaultValue: ''
})
const [shouldPickFromLikeList, setShouldPickFromLikeList] = useLocalStorageState(
  'new-tab.pick-from-like-list',
  {
    defaultValue: false
  }
)
const list = ref<ListItem[]>([])

const setList = (value: ListItem[]) => {
  list.value = value.reverse()
  setLinkList(value.map((item) => item.url))
}

onMounted(async () => {
  if (list.value && list.value?.length > 0) {
    return
  }
  if (linkList.value?.some((item: any) => typeof item === 'string')) {
    const newList: ListItem[] = await Promise.all(
      linkList.value?.map(async (item: any) => {
        const url = typeof item === 'string' ? item : item.url
        const thumbnailData = await loadImage(url)
        return {
          url,
          thumbnailData
        }
      })
    )
    setList(newList)
  }
  await new Promise((resolve) => setTimeout(resolve, 200))
  tryToSetTodayImage()
})

function getRandomElement(arr: ListItem[]): ListItem | undefined {
  if (arr.length === 0) {
    return
  }
  const randomIndex = Math.floor(Math.random() * arr.length)
  console.log(randomIndex)
  return arr[randomIndex]
}

const tryToSetTodayImage = async () => {
  const today = dayjs().format('YYYY-MM-DD')
  if (fetchDate.value === today && props.bgImgSrc) {
    return
  }
  let url = shouldPickFromLikeList.value ? getRandomElement(list.value)?.url : undefined
  if (!url) {
    url = await fetch('https://api.timelessq.com/bing').then((data) => data.url)
  }
  props.setBgImgSrc(url)
  setFetchDate(today)
}

const active = ref(false)

const handleShowDrawer = () => {
  active.value = true
}

const handleSelect = async (item: ListItem) => {
  props.setBgImgSrc(item.url)
  if (!item.thumbnailData) {
    const thumbnailData = await loadImage(item.url)
    let likeList = list.value ? toRaw(list.value) : []
    const findItem = likeList.find((likeItem) => likeItem.url === item.url)
    if (findItem) {
      findItem.thumbnailData = thumbnailData
    }
    setList(likeList)
  }
}

const handleRandom = async () => {
  const url = await fetch('https://api.timelessq.com/bing/random').then((data) => data.url)
  props.setBgImgSrc(url)
}

const handleLikeOrDislike = async () => {
  const { bgImgSrc } = props
  let likeList = list.value ? toRaw(list.value) : []
  if (likeList?.some((item) => item?.url === bgImgSrc)) {
    likeList = likeList.filter((item) => item?.url !== bgImgSrc)
  } else {
    const thumbnailData: string = await loadImage(bgImgSrc || '')
    likeList.push({ url: bgImgSrc || '', thumbnailData: thumbnailData || '' })
  }
  setList(likeList)
}

const handleDelete = (item: ListItem) => {
  const link = typeof item === 'string' ? item : item.url || ''
  let likeList = list.value ? toRaw(list.value) : []
  likeList = likeList.filter((item) => item?.url !== link)
  setList(likeList)
}
</script>

<template>
  <NSpace>
    <NButton round type="primary" @click="handleShowDrawer"> 收藏列表 </NButton>
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton quaternary circle type="success" @click="handleLikeOrDislike">
          <template #icon>
            <NIcon size="30">
              <Heart v-if="list?.some((item) => item?.url === bgImgSrc)" />
              <HeartOutline v-else />
            </NIcon>
          </template>
        </NButton>
      </template>
      {{ list?.some((item) => item?.url === bgImgSrc) ? '不再喜欢' : '喜欢此背景' }}
    </NTooltip>
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton quaternary circle type="success" @click="handleRandom">
          <template #icon>
            <NIcon size="30"> <ReloadOutline /></NIcon>
          </template>
        </NButton>
      </template>
      随机背景
    </NTooltip>
  </NSpace>
  <NDrawer v-model:show="active" :default-width="400" placement="left" resizable>
    <NDrawerContent title="收藏列表">
      <div class="drawer-body">
        <div>
          <NCheckbox v-model:checked="shouldPickFromLikeList" @change="setShouldPickFromLikeList">
            每日刷新从列表中随机
          </NCheckbox>
        </div>
        <NCard
          v-for="(item, index) in list"
          :key="index"
          hoverable
          class="image-item"
          :class="item.url === bgImgSrc ? 'active' : ''"
        >
          <template #cover>
            <img
              @click="handleSelect(item)"
              height="200"
              :src="item.thumbnailData || item.url"
              style="cursor: pointer"
            />
          </template>
          <NButton quaternary circle type="success" @click="handleDelete(item)">
            <template #icon>
              <NIcon size="20"> <TrashOutline /></NIcon>
            </template>
          </NButton>
        </NCard>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<style>
.active {
  transform: scale(1.05);
}
.n-card.n-card--bordered.active {
  border: 2px solid var(--n-color-target);
}

.n-card.image-item > .n-card__content {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 10px;
}

.drawer-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
