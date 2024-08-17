import React, { useEffect, useState } from 'react';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button, Card, Col, Form, message, Row, Input } from 'antd';
import {
  getInterfaceInfoVoById,
  invokeInterfaceInfo,
} from '@/services/lilemy-api-interfaceInfo/interfaceInfoController';
import { useParams } from '@@/exports';

const InterfaceInfo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);

  const params = useParams();

  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoVoById({
        // @ts-ignore
        id: params.id,
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData().then(() => '');
  }, []);

  const doInvoke = async (values: any) => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfo({
        id: params.id,
        ...values,
      });
      setInvokeRes(res.data);
      message.success('请求成功');
    } catch (error: any) {
      message.error('操作失败，' + error.message);
    }
    setInvokeLoading(false);
  };
  return (
    <PageContainer loading={loading}>
      <Row>
        <Col lg={12} md={24}>
          <Card title={data?.name}>
            {data ? (
              <ProDescriptions column={1}>
                <ProDescriptions.Item
                  label="接口状态"
                  valueEnum={{
                    0: {
                      text: '关闭',
                      status: 'Default',
                    },
                    1: {
                      text: '开启',
                      status: 'Success',
                    },
                  }}
                >
                  {data.status}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="描述">{data.description}</ProDescriptions.Item>
                <ProDescriptions.Item label="请求地址">
                  {data.url}{data.path}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="请求方法">{data.method}</ProDescriptions.Item>
                <ProDescriptions.Item label="请求参数" valueType="jsonCode">
                  {data.requestParams}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="请求头">{data.requestHeader}</ProDescriptions.Item>
                <ProDescriptions.Item label="响应头">{data.responseHeader}</ProDescriptions.Item>
              </ProDescriptions>
            ) : (
              <>接口不存在</>
            )}
          </Card>
        </Col>
        <Col lg={12} md={24}>
          <Card title="在线调试">
            <Form name="invoke" layout="vertical" onFinish={doInvoke}>
              <Form.Item
                label="请求参数"
                name="userRequestParams"
                initialValue={data?.requestParams}
              >
                <Input.TextArea autoSize={true} />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 16 }}>
                <Button type="primary" htmlType="submit">
                  调用
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Card title="返回结果" loading={invokeLoading}>
            {invokeRes}
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default InterfaceInfo;
