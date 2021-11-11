export const exitDropdown = {
  cn: {
    exit: '退出登录',
    password: '密码',
    back: '返回管理页',
    dialog: {
      modify: '修改@:password',
      old: '原@:password',
      new: '新@:password',
      confirm: '确认@:password',
    },
    validator: {
      empty: '@:password不能为空。',
      length: '@:password需以字母开头，长度在6~18之间。',
      consistent: '两次输入不一致。',
    },
    message: {
      success: {
        edit: '修改成功',
        logout: '已@:exit',
      },
    },
  },
  en: {
    exit: 'Exit Login',
    password: 'Password',
    back: 'Back',
    dialog: {
      modify: 'Modify @:password',
      old: 'Old',
      new: 'New',
      confirm: 'Confirm',
    },
    validator: {
      empty: '@:password is empty.',
      length: '@:password should start with alphabet, length should be in 6 to 18.',
      consistent: 'Passwords are inconsistent.',
    },
    message: {
      success: {
        edit: 'Success',
        exit: '@:exit Success',
      },
    },
  },
};
