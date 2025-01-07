<template>
  <div class="container" :style="OutStyle">
    <img alt="Vue logo" :src="url" :style="trans" />
    <div
      class="control-point"
      v-for="(_, index) in pointDataArr"
      :style="styles[index]"
      @mousedown.stop="(e) => startDrag(e, index)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from "vue";
import { solveLinearEquations } from "./solve";

const props = defineProps<{ url: string }>();

let width = ref(1);
let height = ref(1);
const maxSize = 500;
const pointDataArr = reactive([
  { origin: { x: 0, y: 0 }, current: { x: 0, y: 0 }, stamp: { x: 0, y: 0 } },
  { origin: { x: 0, y: 0 }, current: { x: 0, y: 0 }, stamp: { x: 0, y: 0 } },
  { origin: { x: 0, y: 0 }, current: { x: 0, y: 0 }, stamp: { x: 0, y: 0 } },
  { origin: { x: 0, y: 0 }, current: { x: 0, y: 0 }, stamp: { x: 0, y: 0 } },
]);

const styles = computed(() => {
  return pointDataArr.map((item) => {
    return {
      transform: `translate(${item.current.x}px, ${item.current.y}px)`,
    };
  });
});

const mat = ref([
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
]);

interface Point {
  x: number;
  y: number;
}

const transform = (m: number[][], p: Point) => {
  const { x, y } = p;
  const a = m[0][0] * x + m[1][0] * y + m[3][0];
  const b = m[0][1] * x + m[1][1] * y + m[3][1];
  const d = m[0][3] * x + m[1][3] * y + 1;
  return { x: a / d, y: b / d };
};

const syncPoint = (w: number, h: number) => {
  pointDataArr[0].origin = { x: -w / 2, y: -h / 2 };
  pointDataArr[1].origin = { x: w / 2, y: -h / 2 };
  pointDataArr[2].origin = { x: w / 2, y: h / 2 };
  pointDataArr[3].origin = { x: -w / 2, y: h / 2 };

  pointDataArr.forEach((item) => {
    item.current = transform(mat.value, item.origin);
  });
};

const syncSize = () => {
  const img = new Image();
  img.src = props.url;
  img.onload = () => {
    const { naturalWidth: w, naturalHeight: h } = img;
    width.value = w;
    height.value = h;
    const k = maxSize / Math.max(w, h);
    width.value *= k;
    height.value *= k;
    syncPoint(w * k, h * k);
  };
};

syncSize();

watch(
  () => props.url,
  () => {
    syncSize();
  }
);

const OutStyle = computed(() => {
  return {
    aspectRatio: `${width.value}/${height.value}`,
    width: `${width.value}px`,
    height: `${height.value}px`,
  };
});

const trans = computed(() => {
  const m = mat.value;
  const transform = `matrix3d(
  ${m[0][0]}, ${m[0][1]}, ${m[0][2]}, ${m[0][3]},
  ${m[1][0]}, ${m[1][1]}, ${m[1][2]}, ${m[1][3]},
  ${m[2][0]}, ${m[2][1]}, ${m[2][2]}, ${m[2][3]},
  ${m[3][0]}, ${m[3][1]}, ${m[3][2]}, ${m[3][3]}
  )`;

  return {
    transform,
    ...OutStyle.value,
  };
});

const getEquation = (p: Point, q: Point) => {
  return [
    [p.x, p.y, 1, 0, 0, 0, -p.x * q.x, -p.y * q.x, q.x],
    [0, 0, 0, p.x, p.y, 1, -p.x * q.y, -p.y * q.y, q.y],
  ];
};

const getMatrix = () => {
  const getEquations = () => {
    const equations = pointDataArr.map((item) => {
      return getEquation(item.origin, item.current);
    });
    return equations.flat();
  };
  const equations = getEquations();
  const ans = solveLinearEquations(equations);
  if (!ans) return mat.value;
  const matrix = [
    [ans[0], ans[3], 0, ans[6]],
    [ans[1], ans[4], 0, ans[7]],
    [0, 0, 1, 0],
    [ans[2], ans[5], 0, 1],
  ];

  return matrix;
};

let i = 0;
let startPos = { x: 0, y: 0 };
const startDrag = (event: MouseEvent, index: number) => {
  event.preventDefault();
  startPos = { x: event.clientX, y: event.clientY };
  i = index;
  const pointData = pointDataArr[index];
  pointData.stamp = { x: pointData.current.x, y: pointData.current.y };
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", drayOver);
};

const handleDrag = (event: MouseEvent) => {
  const { clientX, clientY } = event;
  const pointData = pointDataArr[i];
  const dx = clientX - startPos.x;
  const dy = clientY - startPos.y;
  pointData.current = {
    x: pointData.stamp.x + dx,
    y: pointData.stamp.y + dy,
  };
  mat.value = getMatrix();
};

const drayOver = (_: MouseEvent) => {
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", drayOver);
};
</script>

<style scoped>
.img {
  max-width: 300px;
  max-height: 300px;
  /* aspect-ratio: 1; */
}

.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-point {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgb(147, 190, 231);
  border: 2px solid blue;
  position: absolute;
  cursor: move;
}
</style>
