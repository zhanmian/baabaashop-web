import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: { title: '自述文件' },
      children:[
        {
          path: '/dashboard',
          component: resolve => require(['../components/page/Dashboard.vue'], resolve),
          meta: { title: '系统首页' }
        },
        {
          path: '/icon',
          component: resolve => require(['../components/page/Icon.vue'], resolve),
          meta: { title: '自定义图标' }
        },
        {
          path: '/add_product',
          component: resolve => require(['../components/product/AddProduct.vue'], resolve),
          meta: { title: '添加商品' }
        },
        {
          path: '/update_product',
          component: resolve => require(['../components/product/UpdateProduct.vue'], resolve),
          meta: { title: '更新商品' }
        },
        {
          path: '/product_detail',
          component: resolve => require(['../components/product/ProductDetail.vue'], resolve),
          meta: { title: '商品详情组件' },
          hidden: true
        },
        {
          path: '/product_list',
          component: resolve => require(['../components/product/Product.vue'], resolve),
          meta: { title: '商品列表' }
        },
        {
          path: '/product_category',
          component: resolve => require(['../components/productCategory/ProductCategory.vue'], resolve),
          meta: { title: '商品分类' }
        },
        {
          path: '/product_category_detail',
          component: resolve => require(['../components/productCategory/ProductCategoryDetail.vue'], resolve),
          meta: { title: '商品分类详情组件' },
          hidden: true
        },
        {
          path: '/add_product_category',
          component: resolve => require(['../components/productCategory/AddProductCategory.vue'], resolve),
          meta: { title: '添加商品分类' },
        },
        {
          path: '/update_product_category',
          component: resolve => require(['../components/productCategory/UpdateProductCategory.vue'], resolve),
          meta: { title: '更新商品分类' }
        },
        {
          path: '/product_attribute',
          component: resolve => require(['../components/productAttribute/ProductAttribute.vue'], resolve),
          meta: { title: '商品属性' }
        },
        {
          path: '/product_attribute_detail',
          component: resolve => require(['../components/productAttribute/ProductAttributeDetail.vue'], resolve),
          meta: { title: '商品属性详情组件' },
          hidden: true
        },
        {
          path: '/add_product_attribute',
          component: resolve => require(['../components/productAttribute/AddProductAttribute.vue'], resolve),
          meta: { title: '添加商品属性' },
        },
        {
          path: '/update_product_attribute',
          component: resolve => require(['../components/productAttribute/UpdateProductAttribute.vue'], resolve),
          meta: { title: '更新商品属性' }
        },
        {
          path: '/attribute_category',
          component: resolve => require(['../components/productAttributeCategory/ProductAttributeCategory.vue'], resolve),
          meta: { title: '商品属性分类' }
        },
        {
          path: '/order',
          component: resolve => require(['../components/order/Order.vue'], resolve),
          meta: { title: '订单列表' }
        },
        {
          path: '/get_order_detail',
          component: resolve => require(['../components/order/OrderDetail.vue'], resolve),
          meta: { title: '订单详情' }
        },
        {
          path: '/tabs',
          component: resolve => require(['../components/page/Tabs.vue'], resolve),
          meta: { title: 'tab选项卡' }
        },
        {
          // 富文本编辑器组件
          path: '/editor',
          component: resolve => require(['../components/page/VueEditor.vue'], resolve),
          meta: { title: '富文本编辑器' }
        },
        {
          // 图片上传组件
          path: '/upload',
          component: resolve => require(['../components/page/Upload.vue'], resolve),
          meta: { title: '文件上传' }
        },
        {
          // 权限页面
          path: '/permission',
          component: resolve => require(['../components/page/Permission.vue'], resolve),
          meta: { title: '权限测试', permission: true }
        },
        {
          path: '/404',
          component: resolve => require(['../components/page/404.vue'], resolve),
          meta: { title: '404' }
        },
        {
          path: '/403',
          component: resolve => require(['../components/page/403.vue'], resolve),
          meta: { title: '403' }
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
