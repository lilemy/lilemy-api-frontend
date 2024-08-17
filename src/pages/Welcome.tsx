import { PageContainer, ProList } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { listInterfaceInfoByPage } from '@/services/lilemy-api-interfaceInfo/interfaceInfoController';
import { List, message } from 'antd';

/**
 * 主页
 * @constructor
 */
const Welcome: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);
  const loadData = async (current = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoByPage({
        current,
        pageSize,
      });
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData().then(() => '');
  }, []);
  return (
    <PageContainer title="在线接口开放平台">
      <ProList
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          const id = item.id;
          console.log(id);
          const apiLink = `/interface_info/${item.id}`;
          return (
            <List.Item
              actions={[
                <a key={item.id} href={apiLink}>
                  查看
                </a>,
              ]}
            >
              <List.Item.Meta
                title={<a href={apiLink}>{item.name}</a>}
                description={item.description}
              />
            </List.Item>
          );
        }}
        pagination={{
          showTotal(total: number) {
            return '总数：' + total;
          },
          pageSize: 5,
          total,
          onChange(page, pageSize) {
            loadData(page, pageSize).then(() => '');
          },
        }}
      />
    </PageContainer>
  );
};

export default Welcome;
