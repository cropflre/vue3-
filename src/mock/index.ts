import Mock, { Random } from 'mockjs'; //导入mockjs

Mock.mock('./get_table_list', 'get', {
  'list|1-500': [
    {
      'base_image|+1': 'tf_@string("number", 2)_hdfs_@string("number", 3)_gpu',
      'id|1-500': 100,
      image_cname: '@string("lower", 8)',
      image_desc: '@cparagraph(1, 3)',
      image_name: `@first`,
      packages: [
        'redis==@string("number", 3)',
        'aiohttp==3.8.4',
        'six==1.16.0',
        'requests==2.25.1',
        'PyYAML==6.0',
        'protobuf==3.17.3',
        'pandas==1.1.5',
        'numpy==1.18.5',
        'mysqlclient==2.1.1',
        'matplotlib==3.3.4',
        'Markdown==3.3.4',
        'h5py==2.10.0',
        'grpcio==1.38.0',
      ],
    },
  ],
  status: 200, //请求成功状态码
});
