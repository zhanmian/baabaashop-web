<template>
  <product-category-detail :is-edit='true'></product-category-detail>
</template>

<script>
  import ProductCategoryDetail from './ProductCategoryDetail'
  export default {
    name: 'updateProductCategory',
    components: { ProductCategoryDetail }
  }
</script>

<style scoped>

</style>
