  import React from "react";
  import { Button, Modal, Form, Input, DatePicker, Select} from "antd";
  function AddIncomeModal({
    isIncomeModalVisible,
    handleIncomeCancel,
    onFinish,
  }) {
    const [form] = Form.useForm();
    return (
      <Modal
        style={{ fontWeight: 600 }}
        title="Add Income"
        open={isIncomeModalVisible}
        onCancel={handleIncomeCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            onFinish(values, "income");
            form.resetFields();
          }}
        >
          <Form.Item
            style={{ fontWeight: 600 }}
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name of the transaction!",
              },
            ]}
          >
            <Input type="text" className="custom-input" />
          </Form.Item>
          <Form.Item
            style={{ fontWeight: 600 }}
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: "Please input the income amount!" },
            ]}
          >
            <Input type="number" className="custom-input" />
          </Form.Item>
          <Form.Item
            style={{ fontWeight: 600 }}
            label="Date"
            name="date"
            rules={[
              { required: true, message: "Please select the income date!" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" className="custom-input" />
          </Form.Item>
          <Form.Item
            style={{ fontWeight: 600 }}
            label="Tag"
            name="tag"
            rules={[{ required: true, message: "Please select a tag!" }]}
          >
            <Select className="select-input-2"
            mode="tags" // Allows the user to add custom tags
            placeholder="Add tags (press Enter to confirm)">
            <Select.Option key="salary" value="salary">Salary</Select.Option>
            <Select.Option key="freelance" value="freelance">Freelance</Select.Option>
            <Select.Option key="investment" value="investment">Investment</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button className="btn btn-blue" type="primary" htmlType="submit">
              Add Income
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  export default AddIncomeModal;
