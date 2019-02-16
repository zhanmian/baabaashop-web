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
          component: resolve => require(['../components/page/AddProduct.vue'], resolve),
          meta: { title: '添加商品' }
        },
        {
          path: '/update_product',
          component: resolve => require(['../components/page/UpdateProduct.vue'], resolve),
          meta: { title: '更新商品' }
        },
        {
          path: '/product_detail',
          component: resolve => require(['../components/page/ProductDetail.vue'], resolve),
          meta: { title: '商品详情组件' },
          hidden: true
        },
        {
          path: '/product_list',
          component: resolve => require(['../components/page/Product.vue'], resolve),
          meta: { title: '商品列表' }
        },
        {
          path: '/product_category',
          component: resolve => require(['../components/page/ProductCategory.vue'], resolve),
          meta: { title: '商品分类' }
        },
        {
          path: '/product_category_detail',
          component: resolve => require(['../components/page/ProductCategoryDetail.vue'], resolve),
          meta: { title: '商品分类详情组件' },
          hidden: true
        },
        {
          path: '/add_product_category',
          component: resolve => require(['../components/page/AddProductCategory.vue'], resolve),
          meta: { title: '添加商品分类' },
        },
        {
          path: '/update_product_category',
          component: resolve => require(['../components/page/UpdateProductCategory.vue'], resolve),
          meta: { title: '更新商品分类' }
        },
        {
          path: '/product_attribute',
          component: resolve => require(['../components/page/ProductAttribute.vue'], resolve),
          meta: { title: '商品属性' }
        },
        {
          path: '/product_attribute_detail',
          component: resolve => require(['../components/page/ProductAttributeDetail.vue'], resolve),
          meta: { title: '商品属性详情组件' },
          hidden: true
        },
        {
          path: '/add_product_attribute',
          component: resolve => require(['../components/page/AddProductAttribute.vue'], resolve),
          meta: { title: '添加商品属性' },
        },
        {
          path: '/update_product_attribute',
          component: resolve => require(['../components/page/UpdateProductAttribute.vue'], resolve),
          meta: { title: '更新商品属性' }
        },
        {
          path: '/attribute_category',
          component: resolve => require(['../components/page/ProductAttributeCategory.vue'], resolve),
          meta: { title: '商品属性分类' }
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
          // vue-schart组件
          path: '/charts',
          component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
          meta: { title: 'schart图表' }
        },
        // {
        //   // 拖拽列表组件
        //   path: '/drag',
        //   component: resolve => require(['../components/page/DragList.vue'], resolve),
        //   meta: { title: '拖拽列表' }
        // },
        // {
        //   // 拖拽Dialog组件
        //   path: '/dialog',
        //   component: resolve => require(['../components/page/DragDialog.vue'], resolve),
        //   meta: { title: '拖拽弹框' }
        // },
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
