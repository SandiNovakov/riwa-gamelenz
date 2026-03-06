<template>
  <div class="image-uploader-container">
    <q-file
      filled
      v-model="localFile"
      :label="label"
      :accept="accept"
      class="q-mb-md"
    />

    <!-- Large preview area with constrained dimensions -->
    <div v-if="previewUrl" class="row justify-center q-mb-md">
      <q-img
        :src="previewUrl"
        :style="previewStyle"
        class="rounded-borders"
        fit="contain"
      />
    </div>

    <!-- Placeholder when no image -->
    <div
      v-else
      class="row justify-center items-center q-mb-md bg-grey-3 rounded-borders"
      :style="placeholderStyle"
    >
      <q-icon name="image" size="48px" color="grey-6" />
      <div class="text-grey-6 q-ml-sm text-caption">Nema slike</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, computed } from "vue";

const props = defineProps({
  modelValue: File,
  label: {
    type: String,
    default: "Odaberi sliku",
  },
  accept: {
    type: String,
    default: ".jpg,.jpeg,.png,.gif",
  },
  previewWidth: {
    type: String,
    default: "200px",
  },
  previewHeight: {
    type: String,
    default: "150px",
  },
  initialPreview: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:model-value"]);

const localFile = ref(props.modelValue);
const previewUrl = ref(props.initialPreview || null);

const previewStyle = computed(() => ({
  width: props.previewWidth,
  height: props.previewHeight,
}));

const placeholderStyle = computed(() => ({
  width: props.previewWidth,
  height: props.previewHeight,
}));

// Watch for file changes
// Watch for file changes
// Add this watch to react to prop changes
watch(
  () => props.initialPreview,
  (newVal) => {
    // Only update if we don't have a local file selected
    if (!localFile.value) {
      previewUrl.value = newVal;
    }
  },
  { immediate: true },
);

// Modify the existing watch to respect initialPreview
watch(localFile, (file) => {
  if (
    previewUrl.value &&
    !previewUrl.value.startsWith("data:") &&
    !props.initialPreview
  ) {
    URL.revokeObjectURL(previewUrl.value);
  }

  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  } else {
    previewUrl.value = props.initialPreview || null;
  }

  emit("update:model-value", file);
});
onBeforeUnmount(() => {
  // Only revoke if it's a blob URL (not a data URL)
  if (previewUrl.value && !previewUrl.value.startsWith("data:")) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<style scoped>
.image-uploader-container {
  width: 100%;
}
</style>
