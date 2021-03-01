<template>
    <Popup id="login" v-model="showModal" :overlay="overlay" :close-on-click-overlay="allowClose" :round="true" get-container="#app">
        <div class="login_inner">
            <Form @submit="onSubmit">
                <div class="phone_row">
                    <Field v-model="phone" name="phone"
                           @input="handlePhoneInput"
                           maxlength='11' type="tel" placeholder="请输入广东号码" :readonly="!allowPhoneInput"/>
                </div>
                <div class="code_row">
                    <Field class="code_left" @input="handleCodeInput" v-model="code" name="code" maxlength='6' placeholder="请输入验证码"/>
                    <Button class="code_right" :disabled="!allowCode" @click.stop="onClickCode" native-type="button" color="linear-gradient(to right, #3b9cff,  #4f78ff)" size="large">{{codeText}}</Button>
                </div>
                <Row class="protocol_row" type="flex" v-if="protocol" @click="changeSelect">
                    <VanCol>
                        <img class="select" v-if="select" src="./img/select-true.png" alt="">
                        <img class="select" v-else src="./img/select.png" alt="">
                    </VanCol>
                    <VanCol>
                        <solt name="protocol">
                            <div class="protocol_text">{{protocol}}</div>
                        </solt>
                    </VanCol>
                </Row>
                <div class="btn_row">
                    <Button color="linear-gradient(to right, #3b9cff,  #4f78ff)" native-type="submit" :disabled="!allowSubmit" size="large">登录</Button>
                </div>
            </Form>
        </div>
        <label style='display:none;'>
            <input type="text" :value="value">
        </label>
    </Popup>
</template>

<script>
    import {Form,Field,Button,Popup,Toast,Col, Row } from 'vant'
    export default {
        name: "login",
        props:{
            //协议
            protocol:{
                type:String,
                default:'',
            },
            value:{
                type:Boolean
            },
            //
            overlay:{
                type:Boolean,
                default: true
            },
            allowClose:{
                type:Boolean,
                default:true
            },
            bussnissId:{
                type:String,
                required: true
            },
        },
        data() {
            return this.getData()
        },
        mounted(){
            // this.toastM('提示问题');
        },
        methods:{
            onSubmit(values) {
                const _this = this;
                _this.$sys_doAjax({
                    service: 'login',
                    servicePath: 'GMCCAPP_000_000_001_010',
                    jsonData: {
                        mobileNumber: values.phone,
                        bussnissId:_this.bussnissId,
                        isGDMobile: _this.loginM.isGDMobile,
                        password: values.code,
                        identifyingCode: '',
                    }
                }).then((res)=>{
                    const data = res.data,
                        result = data.result,
                        desc = data.desc;
                    switch (result) {
                        case '000':
                            _this.$emit('success',values.phone,res);
                            if (_this.extendSuccessFun) _this.extendSuccessFun();
                            break;
                        default:
                            _this.toastM(desc)

                    }
                })
            },
            toastM(t){
                this.toast = Toast({
                    position:'bottom',
                    message:t,
                    duration:4000,
                    className:'custom_toast'
                })
            },
            onClickCode(){
                const _this = this;
                _this.allowCode = false;
                _this.codeText = '正在发送';

                // _this.getVcodeCutDowns();

                _this.$sys_doAjax({
                    service: 'login',
                    servicePath: 'GMCCAPP_000_000_001_009',
                    jsonData: {
                        mobileNumber: _this.phone,
                        bussnissId:_this.bussnissId
                    }
                }).then((res)=>{
                    const data = res.data,
                        result = data.result,
                        desc = data.desc;
                    switch (result) {
                        case '000':
                            _this.getVcodeCutDowns();
                            _this.loginM.isGDMobile= data.isGDMobile;
                            _this.toastM(desc);
                            break;
                        case '112':
                            _this.codeText = '获取验证码';
                            _this.allowCode = true;
                            _this.toastM('非常抱歉，您的手机号码非广东移动！');
                            break;
                        default:
                            _this.allowCode = true;
                            _this.codeText = '重新获取';
                            _this.toastM(desc)

                    }
                }).catch(()=>{
                    _this.allowCode = true;
                    _this.codeText = '重新获取';
                    _this.toastM('系统繁忙！')
                })
            },
            handlePhoneInput(val){
                this.allowSubmit=false;
                if (val.length===11&&(/^1[3-9]\d{9}$/.test(val))) {
                    this.allowCode=true;
                }else {
                    this.allowCode=false;
                    this.code=''
                }
            },
            getVcodeCutDowns() {
                this.allowPhoneInput = false;
                this.codeText = `${this.codeTime}s`;
                this.codeTime-=1;
                if (this.codeTime>=0) {
                    const _this = this;
                    this.codeSetTimeOut = setTimeout(function () {
                        _this.getVcodeCutDowns()
                    },1000)
                }else {
                    this.allowPhoneInput = true;
                    this.codeText = '获取验证码';
                    this.allowCode = true;
                    this.codeTime = 60
                }

            },
            handleCodeInput(val) {
                if (val.length===6) {
                    if (this.phone.length===11&&(/^1[3-9]\d{9}$/.test(this.phone))) {
                        this.allowSubmit = this.protocol? this.select:true
                    }else {
                        this.allowSubmit=false;
                    }
                }else {
                    this.allowSubmit=false;

                }
            },
            changeSelect(){
                this.select= !this.select;
                this.handleCodeInput(this.code)
            },
            getData(){
                return {
                    phone:'',
                    allowPhoneInput:true,


                    code:'',
                    codeText:'发送验证码',
                    codeTime:60,
                    codeSetTimeOut:null,
                    allowCode:false,

                    allowSubmit:false,

                    select:true,
                    showModal:this.value,
                    toast:null,

                    loginM:{
                    },

                    extendSuccessFun:null,
                }
            },
        },
        computed:{


        },
        components:{
            Form,
            Field,
            Button,
            Popup,
            VanCol:Col,
            Row
            // Toast
        },
        watch:{
            value(val){
                this.showModal = val
            },
            showModal(val) {
                this.$emit('input',val);
                if (!val) {
                    clearTimeout(this.codeSetTimeOut);
                    Object.assign(this.$data,this.getData())
                }
            }
        }
    }
</script>

<style scoped lang="less">
    #login {
        /*background: rgba(0, 0, 0, .3);*/

        &>.login_inner {
            width: 350px;
            border-radius: 10px;
            padding: 40px 30px 50px 30px;
            background-color: white;
            .phone_row {
                margin-bottom: 20px;


            }
            .code_row {
                display: flex;
                align-items: center;

                .code_right {
                    width: 130px;
                    margin-left: 20px;
                    height: 44.5px;
                    border-radius: 8px;
                }

                .code_left {
                    width: 160px;
                }
            }
            .btn_row {

                margin-top: 40px;
                &>button {
                    height: 44.5px;
                    border-radius: 8px;
                }

            }
            .protocol_row {
                font-size: 12px;
                line-height: 18px;
                margin-top: 20px;
                color: #6b6b6b;
                .select {
                    width: 15px;
                    display: block;
                    margin-right: 10px;
                }
                .protocol_text {
                    /*font-size: 16px;*/
                }
            }
        }
    }


</style>
<style lang="less">
    #login{
        .van-field {
            background-color: #dbdbdb;
            border-radius: 8px;
        }
        .van-button--disabled {
            opacity: 1;
            background: #dbdbdb !important;
            color: #969799 !important;
        }
    }
    .custom_toast {
        width: 70% !important;
    }

</style>