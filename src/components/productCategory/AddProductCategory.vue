<template>
  <product-category-detail :is-edit='false'></product-category-detail>
</template>

<script>
  import ProductCategoryDetail from './ProductCategoryDetail'
  export default {
    name: 'addProductCategory',
    components: { ProductCategoryDetail }
  }
</script>

<style scoped>

</style>
