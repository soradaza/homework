/**
 * @file 案件検索ダイアログ
 * @author INTRAMART
 * @version 8.0.0
 */


// 一時保持用変数宣言
let ssfaMtrSrchDiag_searchCond;											// RESTに渡す検索条件(Filterの検索条件も含む)
let ssfaMtrSrchDiag_isFirstSearch;										// 初回検索時フラグ

// 定数設定
const ssfaMtrSrchDiag_partsId = "ssfaMtrSrchDiag";							// パーツID
const ssfaMtrSrchDiag_formId = ssfaMtrSrchDiag_partsId + "_form";							// パーツID
const ssfaMtrSrchDiag_listId = ssfaMtrSrchDiag_partsId + "_matter_search_list";					// リストID
const ssfaMtrSrchDiag_restUri = "api/dps/ssfa/v1/get_matter_search_dialog";	// REST_URI
const ssfaMtrSrchDiag_defaultSort = "matter_name ASC";		// 初期ソート項目


// 各列のフォーマッター設定
const ssfaMtrSrchDiag_formatterColumns = {
};
//チェックボックス値の指定
//詳細画面のセレクトボックスの設定
const ssfaMtrSrchDiag_selectParamAry = [];
ssfaMtrSrchDiag_selectParamAry.push(
	// 自部署
	{
		target_date: ssfaGetNowDate(),
		cd_type: "RSFA_SEARCH_OWN_DEPT_ONLY_CD",
		id: ssfaMtrSrchDiag_partsId + "_own_dept_flag",
		type: "check",
		application_id: SSFA_APPLICATION_ID,
		locale_id: ssfaGetLoginLocaleId()
	},
	// 自担当
	{
		target_date: ssfaGetNowDate(),
		cd_type: "SSFA_SEARCH_OWNER_CD",
		id: ssfaMtrSrchDiag_partsId + "_self_charge_flag",
		type: "check",
		application_id: SSFA_APPLICATION_ID,
		locale_id: ssfaGetLoginLocaleId()
	},
	// 重要
	{
		target_date: ssfaGetNowDate(),
		cd_type: "SSFA_SEARCH_MATTER_IMPORTANT_CD",
		id: ssfaMtrSrchDiag_partsId + "_important_flag",
		type: "check",
		application_id: SSFA_APPLICATION_ID,
		locale_id: ssfaGetLoginLocaleId()
	},
	// 工事
	{
		target_date: ssfaGetNowDate(),
		cd_type: "RSFA_SEARCH_MATTER_CONSTRUCTION_CD",
		id: ssfaMtrSrchDiag_partsId + "_construction_flag",
		type: "check",
		application_id: SSFA_APPLICATION_ID,
		locale_id: ssfaGetLoginLocaleId()
	},
	// 非公開
	{
		target_date: ssfaGetNowDate(),
		cd_type: "RSFA_SEARCH_MATTER_HIDDEN_CD",
		id: ssfaMtrSrchDiag_partsId + "_hidden_flag",
		type: "check",
		application_id: SSFA_APPLICATION_ID,
		locale_id: ssfaGetLoginLocaleId()
	},
	// 内部取引区分
	{
		target_date: ssfaGetNowDate(),
		cd_type: "RSFA_SEARCH_MATTER_INTERNAL_BIZ_CD",
		id: ssfaMtrSrchDiag_partsId + "_internal_biz_flag",
		type: "check",
		application_id: SSFA_APPLICATION_ID,
		locale_id: ssfaGetLoginLocaleId()
	},
	// 注力
	{
		target_date: ssfaGetNowDate(),
		cd_type: "RSFA_SEARCH_MATTER_FOCUS_CD",
		id: ssfaMtrSrchDiag_partsId + "_focus_flag",
		type: "check",
		application_id: SSFA_APPLICATION_ID,
		locale_id: ssfaGetLoginLocaleId()
	},
	// 仮状態
	{
		target_date: ssfaGetNowDate(),
		cd_type: "RSFA_SEARCH_MATTER_PROVISIONAL_STATUS_CD",
		id: ssfaMtrSrchDiag_partsId + "_provisional_status",
		type: "check",
		application_id: SSFA_APPLICATION_ID,
		locale_id: ssfaGetLoginLocaleId()
	},
	// NK区分（流れ、基礎、個別）NK_TYPE_CDに合わせる
	{
		target_date: ssfaGetNowDate(),
		cd_type: "RSFA_SEARCH_MATTER_NK_TYPE_CD",
		id: ssfaMtrSrchDiag_partsId + "_nk_type",
		type: "check",
		application_id: SSFA_APPLICATION_ID,
		locale_id: ssfaGetLoginLocaleId()
	}
	
);

/**
 * 案件検索ダイアログの表示処理を実施します。
 *
 * @param successFunc
 *            決定時のコールバック関数
 * @param cancelFunc
 *            キャンセル時のコールバック関数
 * @param searchCond {
 * 						comp_name : String
 * 						}
 *            初期検索条件
 */
function ssfaMtrSrchDiag_openDialog(successFunc, cancelFunc, searchCond){

	//初期値設定
	ssfaMtrSrchDiag_searchCond = scmnIsBlank(searchCond) ? {} : searchCond;
	ssfaMtrSrchDiag_isFirstSearch = true;

	// ダイアログ表示登録
	$('<div />').imuiPageDialog({
			url: "ssfa/common/dialog_parts/search_parts/matter_search",
			method: 'post',
			modal: true,
			title: scmnGetCaption("CAP.Z.SSFA.MATTER_SEARCH"),
			minWidth: 1250,
			minHeight: 600,
			position: ['center', 80],
			global: false,
			dialogClass:"ssfa-dialog--gray",
			parameter : {'imui-theme-builder-module':'notheme'},
			onAjaxComplete: function() {
				ssfaMtrSrchDiag_openCompleteEvent();
			},
			buttons: [
						{
							text: scmnGetCaption("CAP.Z.SSFA.DECISION"),
							id:ssfaMtrSrchDiag_partsId+"_decision",
							click: function() {
								ssfaMtrSrchDiag_successButton(this,successFunc);
							}
						},
						{
							text: scmnGetCaption("CAP.Z.SSFA.CANCEL"),
							id:ssfaMtrSrchDiag_partsId+"_cancel",
							click: function() {
								ssfaMtrSrchDiag_cancelButton(this,cancelFunc);
							}
						}
					],
			close: function(event) {
				ssfaMtrSrchDiag_closeEvent(this,event);
			}
	});
}

/**
 * 案件検索ダイアログの表示時の処理を実施します。 得意先検索、キャンセル処理
 *
 */
function ssfaMtrSrchDiag_openCompleteEvent(){
	// Enterキーによる連続実行禁止
	scmnDisableOnSubmit("#" + ssfaMtrSrchDiag_formId);
	
	// 選択項目生成
		let applyDefault = !$("[id^=ssfaMtrDtl_cond_],[id^=ssfaMtrDtl_searchCond]").filter(function(){return $(this).val();}).length;
		ssfaMtrSrchDiag_selectItemCdList = scmnGetSelectItemData(ssfaMtrSrchDiag_formId, ssfaMtrSrchDiag_selectParamAry, applyDefault);
		//rmstGetSelectItemData(ssfaMtrSrchDiag_formId, rmstParamAry, applyDefault);
        ssfaGetCstmrGroup(ssfaMtrSrchDiag_partsId);
	
	// 自部署チェック
		$("#" + ssfaMtrSrchDiag_partsId + "_own_dept_flag0").change(function () {
			if ($(this).prop('checked')) {
				$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_name").val(rsfaCurrentDeptName).prop('disabled', true);
				$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_code").val(rsfaLoginUserDepartmentCd).prop('disabled', true);
				$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_search").hide();
				$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_clear").hide();
			} else {
				$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_name").val("").prop('disabled', false);
				$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_code").val("").prop('disabled', false);
				$("#" + ssfaMtrSrchDiag_partsId + "_owner_comp_cd").val("");
				$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_set_cd").val("");
				$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_search").show();
				$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_clear").show();
			}
		});


	// 自担当チェック
	$("#" + ssfaMtrSrchDiag_partsId + "_self_charge_flag0").change(function() {
		if($(this).prop('checked')) {
			$("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_name").val($("[name=sfaHeader_user_name]").val()).prop('disabled', true);
			$("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_cd").val($("[name=sfaHeader_user_cd]").val()).prop('disabled', true);
			$("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_name_search").hide();
			$("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_name_clear").hide();
		} else {
			$("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_name").val("").prop('disabled', false);
			$("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_cd").val("").prop('disabled', false);
			$("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_name_search").show();
			$("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_name_clear").show();
		}
	});
	
	// 初期値設定
	ssfaMtrSrchDiag_clearButton();

	// 顧客名検索設定
	$("#" + ssfaMtrSrchDiag_partsId + "_comp_name_search").click(function(){
		ssfaClientSrchDiag_openDialog(successFunc, cancelFunc);
		function successFunc(selectRowData){
			$("#" + ssfaMtrSrchDiag_partsId + "_comp_name").val(selectRowData.comp_name);
		};
		function cancelFunc(){

		};
	});
	
	// 顧客名クリア
	$("#" + ssfaMtrSrchDiag_partsId + "_comp_name_clear").on('click',function(){
		$("#"+ ssfaMtrSrchDiag_partsId + "_comp_name").val('');
	});
	// 担当者名検索
	$("#" + ssfaMtrSrchDiag_partsId + "_user_name_search").click(function(){
		ssfaOpenUserSearchDialog(null, null, SSFA_SEARCH_DIALOG_TYPE.SINGLE, "ssfaMtrSrchDiag_userSrchDiagSelectUser");
	});
	// 担当者名クリア
	$("#" + ssfaMtrSrchDiag_partsId + "_user_name_clear").on('click',function(){
		$("#"+ ssfaMtrSrchDiag_partsId + "_user_name").val('');
	});
	
	// 担当組織検索
	$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_name_search").click(function(){
		ssfaOpenDeptSearchDialog(null, null, SSFA_SEARCH_DIALOG_TYPE.SINGLE, "ssfaMtrSrchDiag_selectOwnerDeptName");
	});
	// 担当組織クリア
	$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_name_clear").on('click',function(){
		$("#"+ ssfaMtrSrchDiag_partsId + "_owner_dept_name").val('');
		$("#"+ ssfaMtrSrchDiag_partsId + "_owner_comp_cd").val("");
		$("#"+ ssfaMtrSrchDiag_partsId + "_owner_dept_set_cd").val("");
		$("#"+ ssfaMtrSrchDiag_partsId + "_owner_dept_cd").val("");
	});
	
	// 担当部署検索
        $("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_search").click(function(){
            ssfaOpenDeptSearchDialog(null, null, SSFA_SEARCH_DIALOG_TYPE.SINGLE, "ssfaMtrSrchDiag_selectOwnerDeptName");

        });
        //　担当部署名クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_owner_dept_name").val("");
            $("#"+ ssfaMtrSrchDiag_partsId + "_owner_comp_cd").val("");
            $("#"+ ssfaMtrSrchDiag_partsId + "_owner_dept_set_cd").val("");
            $("#"+ ssfaMtrSrchDiag_partsId + "_owner_dept_code").val("");
        });
    
   // 主担当者検索
        $("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_name_search").click(function(){
            ssfaOpenUserSearchDialog(null, null, SSFA_SEARCH_DIALOG_TYPE.SINGLE, "ssfaMtrSrchDiag_selectMainOwnerUserName");
        });
        // 主担当者クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_name_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_im_main_owner_user_cd").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_im_main_owner_user_name").val('');
        });
        
        // 主担当者グループ検索
        $("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_group_search").click(function(){
            rsfaOpenGroupSearchDialog(null, null, SSFA_SEARCH_DIALOG_TYPE.SINGLE, "ssfaMtrSrchDiag_selectMainOwnerUserGroupName");
        });
        // 主担当者グループクリア
        $("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_group_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_im_main_owner_user_group_name").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_im_main_owner_user_group_type").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_im_main_owner_user_public_group_set_cd").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_im_main_owner_user_group_code").val('');
        });
        // 主担当者グループを直接変更時
        $("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_group_name").on('change',function(){
            // タイプ、パブリックグループセットコード、グループコードをクリア
            $("#"+ ssfaMtrSrchDiag_partsId + "_im_main_owner_user_group_type").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_im_main_owner_user_public_group_set_cd").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_im_main_owner_user_group_code").val('');
        });
        
        // 作成者検索
        $("#" + ssfaMtrSrchDiag_partsId + "_create_user_search").click(function(){
            ssfaOpenUserSearchDialog(null, null, SSFA_SEARCH_DIALOG_TYPE.SINGLE, "ssfaMtrSrchDiag_selectCreateUserName");
        });
        //　作成者クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_create_user_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_create_user_code").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_create_user_name").val('');
        });  
        
         // 作成者グループ検索
        $("#" + ssfaMtrSrchDiag_partsId + "_create_user_group_search").click(function(){
            rsfaOpenGroupSearchDialog(null, null, SSFA_SEARCH_DIALOG_TYPE.SINGLE, "ssfaMtrSrchDiag_selectCreateUserGroupName");
        });
        // 作成者グループクリア
        $("#" + ssfaMtrSrchDiag_partsId + "_create_user_group_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_create_user_group_code").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_create_user_group_name").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_create_user_group_type").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_create_user_public_group_set_cd").val('');
        });    
        // 作成者グループを直接変更時
        $("#" + ssfaMtrSrchDiag_partsId + "_create_user_group_name").on('change',function(){
            // タイプ、パブリックグループセットコード、グループコードをクリア
            $("#"+ ssfaMtrSrchDiag_partsId + "_create_user_group_type").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_create_user_public_group_set_cd").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_create_user_group_code").val('');
        });


		// 売上顧客--------------------------------------------------------
        // 得意先検索
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_corp_search").click(function(){
            rsfaCstmrCorpSrchDiag_openDialog(successFunc, null, {customer_sms_connect_flg : SSFA_FLAG.ON});
            function successFunc(selectRowData){
                $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_corp_cd").val(selectRowData.customer_cd);
                $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_corp_name").val(selectRowData.customer_short_name);
            }
        });
        // 得意先クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_corp_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_corp_cd").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_corp_name").val('');
        });

        // 得意先拠点検索
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_base_search").click(function(){
            rsfaCstmrBaseSrchDiag_openDialog(successFunc, null, {customer_sms_connect_flg : SSFA_FLAG.ON});
            function successFunc(selectRowData){
                $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_base_cd").val(selectRowData.customer_branch_cd);
                $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_base_name").val(selectRowData.customer_branch_name);
            };
        });
        // 得意先拠点クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_base_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_base_cd").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_base_name").val('');
        });
        // 得意先部署(内部)検索
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_dept_internal_search").click(function(){
            ssfaOpenDeptSearchDialog(null, null, SSFA_SEARCH_DIALOG_TYPE.SINGLE, "ssfaMtrSrchDiag_selectSalesCstmrDeptInternalName");

        });
        //　得意先部署(内部)クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_dept_internal_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_dept_internal_name").val("");
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_dept_internal_comp_cd").val("");
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_dept_internal_dept_set_cd").val("");
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_dept_internal_cd").val("");
        });

        // 得意先担当者(内部)検索
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_internal_search").click(function(){
            ssfaOpenUserSearchDialog(null, null, SSFA_SEARCH_DIALOG_TYPE.SINGLE, "ssfaMtrSrchDiag_selectSalesCstmrPersonInternalName");
        });
        // 得意先担当者(内部)クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_internal_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_internal_cd").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_internal_name").val('');
        }); 

        // 得意先担当者(通常)検索
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_normal_search").click(function(){
            let searchCond = {};
            ssfaClientUserSrchDiag_openDialog(successFunc, null, searchCond, false);
            function successFunc(selectRowData){
                $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_normal_name").val(selectRowData.user_name);
                $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_normal_sys_person_id").val(selectRowData.sys_person_id);
            };
        });
        // 得意先担当者(通常)クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_normal_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_normal_name").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_normal_sys_person_id").val('');
        });
        // 得意先担当者(通常)を直接変更時
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_normal_name").on('change',function(){
            // システムパーソンIDをクリア
            $("#"+ ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_normal_sys_person_id").val('');
        });
        
        // ターゲット顧客--------------------------------------------------------
        // 得意先検索
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_corp_search").click(function(){
            rsfaCstmrCorpSrchDiag_openDialog(successFunc, null, {customer_sms_connect_flg : SSFA_FLAG.ON});
            function successFunc(selectRowData){
                $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_corp_cd").val(selectRowData.customer_cd);
                $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_corp_name").val(selectRowData.customer_short_name);
            }
        });
        // 得意先クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_corp_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_corp_cd").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_corp_name").val('');
        });

        // 得意先拠点検索
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_base_search").click(function(){
            rsfaCstmrBaseSrchDiag_openDialog(successFunc, null, {customer_sms_connect_flg : SSFA_FLAG.ON});
            function successFunc(selectRowData){
                $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_base_cd").val(selectRowData.customer_branch_cd);
                $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_base_name").val(selectRowData.customer_branch_name);
            };
        });
        // 得意先拠点クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_base_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_base_cd").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_base_name").val('');
        });
        
         // 得意先部署(内部)検索
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_dept_internal_search").click(function(){
            ssfaOpenDeptSearchDialog(null, null, SSFA_SEARCH_DIALOG_TYPE.SINGLE, "ssfaMtrSrchDiag_selectTargetCstmrDeptInternalName");

        });
        //　得意先部署(内部)クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_dept_internal_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_dept_internal_name").val("");
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_dept_internal_comp_cd").val("");
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_dept_internal_dept_set_cd").val("");
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_dept_internal_cd").val("");
        });

        // 得意先担当者(内部)検索
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_person_internal_search").click(function(){
            ssfaOpenUserSearchDialog(null, null, SSFA_SEARCH_DIALOG_TYPE.SINGLE, "ssfaMtrSrchDiag_selectTargetCstmrPersonInternalName");
        });
        // 得意先担当者(内部)クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_person_internal_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_person_internal_cd").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_person_internal_name").val('');
        }); 

        // 得意先担当者(通常)検索
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_person_normal_search").click(function(){
            let searchCond = {};
            ssfaClientUserSrchDiag_openDialog(successFunc, null, searchCond, false);
            function successFunc(selectRowData){
                $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_person_normal_name").val(selectRowData.user_name);
                $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_person_normal_sys_person_id").val(selectRowData.sys_person_id);
            };
        });
        // 得意先担当者(通常)クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_person_normal_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_person_normal_name").val('');
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_person_normal_sys_person_id").val('');
        });
        // 得意先担当者(通常)を直接変更時
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_person_normal_name").on('change',function(){
            // システムパーソンIDをクリア
            $("#"+ ssfaMtrSrchDiag_partsId + "_target_cstmr_person_normal_sys_person_id").val('');
        });
        
        
	//会社名が指定されている場合は初期検索を行う
	if(scmnIsNotBlank(ssfaMtrSrchDiag_searchCond.comp_name)){
		$("#"+ ssfaMtrSrchDiag_partsId + "_comp_name").val(ssfaMtrSrchDiag_searchCond.comp_name);
		ssfaMtrSrchDiag_searchButton();
	}
	
	//前画面からの遷移が自担当初期ONの場合
    if(scmnIsNotBlank(ssfaMtrSrchDiag_searchCond.owned_flag) || ssfaMtrSrchDiag_searchCond.owned_flag == SSFA_FLAG.ON){
    	$("#" + ssfaMtrSrchDiag_partsId + "_owner_flag0").prop("checked", true).trigger("change");	
    }
    //前画面からの遷移が初期検索ONの場合
    if(scmnIsNotBlank(ssfaMtrSrchDiag_searchCond.initial_search_flag) || ssfaMtrSrchDiag_searchCond.initial_search_flag == SSFA_FLAG.ON){
        ssfaMtrSrchDiag_searchButton();
    }
    
     // キャンペーン名検索
        $("#" + ssfaMtrSrchDiag_partsId + "_campaign_search").click(function(){
        	rsfaCampaignSrchDiag_openDialog(function(campaignInfo) {
                $("#"+ ssfaMtrSrchDiag_partsId + "_campaign_name").val(campaignInfo.campaign_name);
            }, null, null, false);
        });
        //　キャンペーン名クリア
        $("#" + ssfaMtrSrchDiag_partsId + "_campaign_clear").on('click',function(){
            $("#"+ ssfaMtrSrchDiag_partsId + "_campaign_name").val('');
        });

	// 案件状態1を選択ボタン押下時
	$("#" + ssfaMtrSrchDiag_partsId + "_matter_status1_select").on('click',function() {
		let labelObj = {
				title : scmnGetCaption("CAP.Z.RSFA.MATTER_LIST.SELECT_MATTER_STATUS1"),
				decision_button : scmnGetCaption("CAP.Z.RSFA.MATTER_LIST.SELECT_CHECKED_MATTER_STATUS1")
		}
		ssfaCdDiagRgtr_openDialog("RSFA_MATTER_STATUS1_CD", labelObj, ssfaMtrSrchDiag_partsId + "_matter_status1_list");
	}); 
	
	// 案件状態2を選択ボタン押下時
	$("#" + ssfaMtrSrchDiag_partsId + "_matter_status2_select").on('click',function() {
		let labelObj = {
				title : scmnGetCaption("CAP.Z.RSFA.MATTER_LIST.SELECT_MATTER_STATUS2"),
				decision_button : scmnGetCaption("CAP.Z.RSFA.MATTER_LIST.SELECT_CHECKED_MATTER_STATUS2")
		}
		ssfaCdDiagRgtr_openDialog("RSFA_MATTER_STATUS2_CD", labelObj, ssfaMtrSrchDiag_partsId + "_matter_status2_list");
	});    

	// デザイン初期表示反映
	scmnDesignInit();
	
	//権限での画面項目表示/非表示および有効/無効制御
    ssfaSetAuthItems(ssfaUserAuthInfo);

	// ダイアログ背景の黒いオーバーレイの位置調整
	$('.ui-widget-overlay').css('position', 'fixed');
	

}

/**
 * ユーザ選択ダイアログのコールバック関数です。
 *
 * @param items
 *            選択ユーザ情報
 */
function ssfaMtrSrchDiag_userSrchDiagSelectUser(items) {
	$("#" + ssfaMtrSrchDiag_partsId + "_user_name").val(items[0].data.user_name);
}

/**
 * 組織選択ダイアログのコールバック関数です。
 *
 * @param object
 *            選択組織情報
 */
function ssfaMtrSrchDiag_selectOwnerDeptName(items) {
	$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_name").val(items[0].data.department_name);
	$("#" + ssfaMtrSrchDiag_partsId + "_owner_comp_cd").val(items[0].data.company_cd);
	$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_set_cd").val(items[0].data.department_set_cd);
	$("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_cd").val(items[0].data.department_cd);
}

/**
 * 検索ボタンクリック時の処理を実施します。
 */
function ssfaMtrSrchDiag_searchButton(){
	//インジケータ追加
    $("body").css({"width" : window.innerWidth, "height" : window.innerHeight});
	$("html").imuiIndicator();
	
	setTimeout(
			function(){
				// 入力チェック コメントアウトしてサーバー確認
				if(!ssfaMtrSrchDlg_inputCheck()){
					//インジケータ削除
					$("body").css({"width" : "", "height" : ""});
					$("html").imuiIndicator("destroy");		
					return;
				}
				
				// 初回検索時フラグOFF
				ssfaMtrSrchDiag_isFirstSearch = false;
				// 検索条件取得
				ssfaMtrSrchDiag_searchCond = ssfaSearch_searchButton(ssfaMtrSrchDiag_partsId);
				// グリッド再読み込み
				$("#" + ssfaMtrSrchDiag_listId).setGridParam({page:1}).trigger('reloadGrid');
				//グリッド部リサイズ処理
				$("#" + ssfaMtrSrchDiag_listId).resize();
				
				//インジケータ削除
				$("body").css({"width" : "", "height" : ""});
				$("html").imuiIndicator("destroy");			
			}
	,0);
}


/**
 * クリアボタンクリック時の処理を実施します。
 */
function ssfaMtrSrchDiag_clearButton(applyDefault){
	ssfaSearch_clearButton(ssfaMtrSrchDiag_partsId);
	
	// 担当組織、自組織は復元
	if (ssfaUserAuthInfo.level != SSFA_AUTH_LEVEL.MANAGER
			&& ssfaUserAuthInfo.serach_outer_dept == SSFA_FLAG.OFF) {
		// 管理者権限保持者以外はシスパラ「他組織を検索できるかコード」の状態を反映
		$("#" + ssfaMtrSrchDiag_partsId + "_own_dept_flag0").prop("checked", true).trigger("change");
	}

	// 管理者でなく、他組織参照出ない場合は、ssfaDefaultSelectItemDataの取得結果をそのまま使用
	$("#" + ssfaMtrSrchDiag_partsId + "_own_dept_flag0").trigger("change");

	// 自担当の表示制御更新
	$("#" + ssfaMtrSrchDiag_partsId + "_self_charge_flag0").trigger("change");
	
	// 案件状態1：コードマスタから初期値を設定
		
		let matterStatus1DefaultValueList = [];
		if (applyDefault !== false) {
			for (let i=0; i<ssfaMtrSrchDiag_selectItemCdList.length; i++) {
				if (ssfaMtrSrchDiag_selectItemCdList[i].records.length > 0
						&& ssfaMtrSrchDiag_selectItemCdList[i].records[0].cd_type == "RSFA_MATTER_STATUS1_CD") {
					// 案件状態区分のコードマスタデータのうち、デフォルトフラグがTRUEのデータのみを抽出
					matterStatusDefaultValueList = ssfaMtrSrchDiag_selectItemCdList[i].records.filter(function(cdDataObj){return cdDataObj.default_flag});
					break;
				}
			}
		}
		ssfaSetListTags(ssfaMtrSrchDiag_partsId + "_matter_status1_list", matterStatus1DefaultValueList, {cd : "cd", name : "name"});

		// 案件状態2：コードマスタから初期値を設定
		let matterStatus2DefaultValueList = [];
		if (applyDefault !== false) {
			for (let i=0; i<ssfaMtrSrchDiag_selectItemCdList.length; i++) {
				if (ssfaMtrSrchDiag_selectItemCdList[i].records.length > 0
						&& ssfaMtrSrchDiag_selectItemCdList[i].records[0].cd_type == "RSFA_MATTER_STATUS2_CD") {
					// 案件状態区分のコードマスタデータのうち、デフォルトフラグがTRUEのデータのみを抽出
					matterStatusDefaultValueList = ssfaMtrSrchDiag_selectItemCdList[i].records.filter(function(cdDataObj){return cdDataObj.default_flag});
					break;
				}
			}
		}
		ssfaSetListTags(ssfaMtrSrchDiag_partsId + "_matter_status2_list", matterStatus2DefaultValueList, {cd : "cd", name : "name"});
}

	

/**
 * 案件一覧ダブルクリック時のイベント処理を実施します。
 *
 * @param rowId
 *            対象行の行ID
 */
function ssfaMtrSrchDiag_dbClickRow(rowId){
	$("#"+ssfaMtrSrchDiag_partsId+"_decision").trigger('click');
}

/**
 * 案件一覧の構築完了時の処理(onGridComplete)を実施します。
 *
 */
function ssfaMtrSrchDiag_onGridComplete() {
	// 案件リスト自体のタブストップ無効化
	ssfaDisableTableListTabStop(ssfaMtrSrchDiag_listId);
}

/**
 * 決定ボタンクリック時の処理を実施します。
 *
 * @param thisDialog
 *            ダイアログのthis値
 * @param successFunc
 *            決定時のコールバック関数
 */
function ssfaMtrSrchDiag_successButton(thisDialog, successFunc){
	//ssfaSearchDiag_successButton(ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_listId, thisDialog, successFunc);
	rsfaSearchDiag_successButton(ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_listId, thisDialog, successFunc);
}

/**
 * キャンセルボタンクリック時の処理を実施します。
 *
 * @param thisDialog
 *            ダイアログのthis値
 * @param successFunc
 *            キャンセル時のコールバック関数
 */
function ssfaMtrSrchDiag_cancelButton(thisDialog, cancelFunc){
	ssfaDiag_cancelButton(thisDialog, cancelFunc);
}

/**
 * ダイアログクローズ時の処理を実施します。
 *
 * @param thisDialog
 *            ダイアログのthis値
 * @param event
 *            イベントオブジェクト
 */
function ssfaMtrSrchDiag_closeEvent(thisDialog, event) {
	ssfaDiag_closeEvent(thisDialog, event);
}

/**
 * 案件一覧の表示データの読み込みを実施します。
 *
 * @param request
 *            ソート、ページ条件
 * @param response
 *            結果返却先関数
 */
function ssfaMtrSrchDiag_getData(request, response) {
	// リストテーブル表示
	ssfaList_getData(request, response,
			ssfaMtrSrchDiag_listId,ssfaMtrSrchDiag_restUri, [{key : "matter_info"}], ssfaMtrSrchDiag_isFirstSearch,
			ssfaMtrSrchDiag_searchCond,ssfaMtrSrchDiag_defaultSort,ssfaMtrSrchDiag_formatterColumns,
			null,null,showListFunc,null
		);
	function showListFunc(records, listId) {
		ssfaSearchDiag_showListFunc(records, ssfaMtrSrchDiag_partsId);
	}
}

/**
 * 入力チェックを実施します。　validator追加チェック
 *
 * @return チェック実施結果
*/
function ssfaMtrSrchDlg_inputCheck(){
	// バリデーションルール取得
	let validatorRules = ssfaGetClientValidatorRules(ssfaMtrSrchDiag_rules, ssfaMtrSrchDiag_partsId);
	// 入力チェック対象に拡張項目を追加
	ssfaReferenceValueConvert_section_save(ssfaMtrSrchDiag_formId);
	let result = imuiValidate("#" + ssfaMtrSrchDiag_formId, validatorRules, ssfaMtrSrchDiag_messages, "", errorDispFunc);
	if (!result) {
		return false;
	}
	imuiResetForm("#" + ssfaMtrSrchDiag_formId);
	return true;
	function errorDispFunc(error, element){			
		// 拡張項目条件のエラー
			$(element).closest(".ssfa-item-value").append(error);
		}
	}

	/**
     * パブリック/プライベートグループ選択ダイアログのコールバック関数です。(主担当者グループ)
     *
     * @param items
     *            選択グループ情報
     */
	function ssfaMtrSrchDiag_selectMainOwnerUserGroupName(items) {
		$("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_group_code").val(scmnIsNotBlank(items[0].data.public_group_cd) ? items[0].data.public_group_cd : items[0].data.private_group_cd);
		$("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_group_name").val(scmnIsNotBlank(items[0].data.public_group_name) ? items[0].data.public_group_name : items[0].data.private_group_name);
		$("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_group_type").val(items[0].type);
		$("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_public_group_set_cd").val(items[0].data.public_group_set_cd);
	}

	/**
     * ユーザ選択ダイアログのコールバック関数です。（作成者）
     *
     * @param items
     *            選択ユーザ情報
     */
    function ssfaMtrSrchDiag_selectCreateUserName(items) {
        $("#" + ssfaMtrSrchDiag_partsId + "_create_user_code").val(items[0].data.user_cd);
        $("#" + ssfaMtrSrchDiag_partsId + "_create_user_name").val(items[0].data.user_name);
    }
    
    /**
     * パブリック/プライベートグループ選択ダイアログのコールバック関数です。（作成者グループ）
     *
     * @param items
     *            選択グループ情報
     */
    function ssfaMtrSrchDiag_selectCreateUserGroupName(items) {
        $("#" + ssfaMtrSrchDiag_partsId + "_create_user_group_code").val(scmnIsNotBlank(items[0].data.public_group_cd) ? items[0].data.public_group_cd : items[0].data.private_group_cd);
        $("#" + ssfaMtrSrchDiag_partsId + "_create_user_group_name").val(scmnIsNotBlank(items[0].data.public_group_name) ? items[0].data.public_group_name : items[0].data.private_group_name);
        $("#" + ssfaMtrSrchDiag_partsId + "_create_user_group_type").val(items[0].type);
        $("#" + ssfaMtrSrchDiag_partsId + "_create_user_public_group_set_cd").val(items[0].data.public_group_set_cd);
    }

	    /**
     * 組織選択ダイアログのコールバック関数です。（売上顧客得意先部署(内部)）
     *
     * @param items
     *            選択組織情報
     */
    function ssfaMtrSrchDiag_selectSalesCstmrDeptInternalName(items) {
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_dept_internal_cd").val(items[0].data.department_cd);
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_dept_internal_name").val(items[0].data.department_name);
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_dept_internal_comp_cd").val(items[0].data.company_cd);
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_dept_internal_dept_set_cd").val(items[0].data.department_set_cd);
    }

    /**
     * ユーザ選択ダイアログのコールバック関数です。（売上顧客得意先担当者(内部)）
     *
     * @param items
     *            選択ユーザ情報
     */
    function ssfaMtrSrchDiag_selectSalesCstmrPersonInternalName(items) {
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_internal_cd").val(items[0].data.user_cd);
        $("#" + ssfaMtrSrchDiag_partsId + "_sales_cstmr_person_internal_name").val(items[0].data.user_name);
    }

    /**
     * 組織選択ダイアログのコールバック関数です。（ターゲット顧客得意先部署(内部)）
     *
     * @param items
     *            選択組織情報
     */
    function ssfaMtrSrchDiag_selectTargetCstmrDeptInternalName(items) {
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_dept_internal_cd").val(items[0].data.department_cd);
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_dept_internal_name").val(items[0].data.department_name);
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_dept_internal_comp_cd").val(items[0].data.company_cd);
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_dept_internal_dept_set_cd").val(items[0].data.department_set_cd);
    }

    /**
     * ユーザ選択ダイアログのコールバック関数です。（ターゲット顧客得意先担当者(内部)）
     *
     * @param items
     *            選択ユーザ情報
     */
    function ssfaMtrSrchDiag_selectTargetCstmrPersonInternalName(items) {
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_person_internal_cd").val(items[0].data.user_cd);
        $("#" + ssfaMtrSrchDiag_partsId + "_target_cstmr_person_internal_name").val(items[0].data.user_name);
    }

		// サジェスト -----------------------------------------------------------------

    /**
     * 担当部署サジェスト（検索用）
     *
     */
    function ssfaMtrSrchDiag_suggestDept(event, flag){
        if(flag == "1"){
            // コード
            suggestDept(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_owner_dept_code', ssfaMtrSrchDiag_partsId + '_owner_dept_code', ssfaMtrSrchDiag_partsId + '_owner_dept_name',
			ssfaMtrSrchDiag_partsId + '_owner_comp_cd', ssfaMtrSrchDiag_partsId + '_owner_dept_set_cd', $('#rsfaSuggestSample_deptCd').val());
        }else if(flag == "2"){
            // 名称
            suggestDept(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_owner_dept_name', ssfaMtrSrchDiag_partsId + '_owner_dept_code', ssfaMtrSrchDiag_partsId + '_owner_dept_name',
			ssfaMtrSrchDiag_partsId + '_owner_comp_cd', ssfaMtrSrchDiag_partsId + '_owner_dept_set_cd', '');
        }
    }
    
     /**
     * 主担当者サジェスト（検索用）
     *
     */
    function ssfaMtrSrchDiag_suggestMainOwnerUser(event, flag){
        if(flag == "1"){
            // コード
            suggestUser(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_im_main_owner_user_cd', ssfaMtrSrchDiag_partsId + '_im_main_owner_user_cd', ssfaMtrSrchDiag_partsId + '_im_main_owner_user_name','');
        }else if(flag == "2"){
            // 名称
            suggestUser(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_im_main_owner_user_name', ssfaMtrSrchDiag_partsId + '_im_main_owner_user_cd', ssfaMtrSrchDiag_partsId + '_im_main_owner_user_name', '');
        }
    }

    /**
     * 自社担当者サジェスト（検索用）
     *
     */
    function ssfaMtrSrchDiag_suggestOwnerUser(event, flag){
        if(flag == "1"){
            // コード
            suggestUser(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_im_owner_user_cd', ssfaMtrSrchDiag_partsId + '_im_owner_user_cd', ssfaMtrSrchDiag_partsId + '_im_owner_user_name','');
        }else if(flag == "2"){
            // 名称
            suggestUser(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_im_owner_user_name', ssfaMtrSrchDiag_partsId + '_im_owner_user_cd', ssfaMtrSrchDiag_partsId + '_im_owner_user_name', '');
        }
    }

   

    /**
     * 売上顧客得意先サジェスト（検索用）
     *
     */
    function ssfaMtrSrchDiag_suggestSalesCstmr(event, flag){
        if(flag == "3"){
            // コード
            suggestCstmr(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_sales_cstmr_corp_cd', ssfaMtrSrchDiag_partsId + '_sales_cstmr_corp_cd', ssfaMtrSrchDiag_partsId + '_sales_cstmr_corp_name', '2', '');
        }else if(flag == "4"){
            // 名称
            suggestCstmr(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_sales_cstmr_corp_name', ssfaMtrSrchDiag_partsId + '_sales_cstmr_corp_cd', ssfaMtrSrchDiag_partsId + '_sales_cstmr_corp_name', '2', '');
        }
    }

    /**
     * 売上顧客得意先拠点サジェスト（検索用）
     *
     */
    function ssfaMtrSrchDiag_suggestSalesCstmrBase(event, flag){
        if(flag == "3"){
            // コード
            suggestCstmrBase(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_sales_cstmr_base_cd', ssfaMtrSrchDiag_partsId + '_sales_cstmr_base_cd', ssfaMtrSrchDiag_partsId + '_sales_cstmr_base_name', '2', $('#' + ssfaMtrSrchDiag_partsId + '_sales_cstmr_corp_cd').val(), '');
        }else if(flag == "4"){
            // 名称
            suggestCstmrBase(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_sales_cstmr_base_name', ssfaMtrSrchDiag_partsId + '_sales_cstmr_base_cd', ssfaMtrSrchDiag_partsId + '_sales_cstmr_base_name', '2', $('#' + ssfaMtrSrchDiag_partsId + '_sales_cstmr_corp_cd').val(), '');
        }
    }

    /**
     * ターゲット顧客得意先サジェスト（検索用）
     *
     */
    function ssfaMtrSrchDiag_suggestTargetCstmr(event, flag){
        if(flag == "3"){
            // コード
            suggestCstmr(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_target_cstmr_corp_cd', ssfaMtrSrchDiag_partsId + '_target_cstmr_corp_cd', ssfaMtrSrchDiag_partsId + '_target_cstmr_corp_name', '2', '');
        }else if(flag == "4"){
            // 名称
            suggestCstmr(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_target_cstmr_corp_name', ssfaMtrSrchDiag_partsId + '_target_cstmr_corp_cd', ssfaMtrSrchDiag_partsId + '_target_cstmr_corp_name', '2', '');
        }
    }

    /**
     * ターゲット顧客得意先拠点サジェスト（検索用）
     *
     */
    function ssfaMtrSrchDiag_suggestTargetCstmrBase(event, flag){
        if(flag == "3"){
            // コード
            suggestCstmrBase(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_target_cstmr_base_cd', ssfaMtrSrchDiag_partsId + '_target_cstmr_base_cd', ssfaMtrSrchDiag_partsId + '_target_cstmr_base_name', '2', $('#' + ssfaMtrSrchDiag_partsId + '_target_cstmr_corp_cd').val(), '');
        }else if(flag == "4"){
            // 名称
            suggestCstmrBase(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_target_cstmr_base_name', ssfaMtrSrchDiag_partsId + '_target_cstmr_base_cd', ssfaMtrSrchDiag_partsId + '_target_cstmr_base_name', '2', $('#' + ssfaMtrSrchDiag_partsId + '_target_cstmr_corp_cd').val(), '');
        }
    }
    
    /**
     * 作成者サジェスト（検索用）
     *
     */
    function ssfaMtrSrchDiag_suggestCreateUser(event, flag){
        if(flag == "1"){
            // コード
            suggestUser(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_create_user_code', ssfaMtrSrchDiag_partsId + '_create_user_code', ssfaMtrSrchDiag_partsId + '_create_user_name','');
        }else if(flag == "2"){
            // 名称
            suggestUser(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_create_user_name', ssfaMtrSrchDiag_partsId + '_create_user_code', ssfaMtrSrchDiag_partsId + '_create_user_name', '');
        }
    }

    /**
     * ターゲット顧客（NB開発用）得意先サジェスト（検索用）
     *
     */
    function ssfaMtrSrchDiag_suggestTargetNbCstmr(event, flag){
        if(flag == "3"){
            // コード
            suggestCstmr(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_corp_cd', ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_corp_cd', ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_corp_name', '2', '');
        }else if(flag == "4"){
            // 名称
            suggestCstmr(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_corp_name', ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_corp_cd', ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_corp_name', '2', '');
        }
    }

    /**
     * ターゲット顧客（NB開発用）得意先拠点サジェスト（検索用）
     *
     */
    function ssfaMtrSrchDiag_suggestTargetNbCstmrBase(event, flag){
        if(flag == "3"){
            // コード
            suggestCstmrBase(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_base_cd', ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_base_cd', ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_base_name', '2', $('#' + ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_corp_cd').val(), '');
        }else if(flag == "4"){
            // 名称
            suggestCstmrBase(event, '0', ssfaMtrSrchDiag_partsId, ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_base_name', ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_base_cd', ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_base_name', '2', $('#' + ssfaMtrSrchDiag_partsId + '_target_cstmr_nb_corp_cd').val(), '');
        }
    }

   


	// 選択ダイアログ -----------------------------------------------------------------

    /**
     * 組織選択ダイアログのコールバック関数です。（担当部署）
     *
     * @param items
     *            選択組織情報
     */
    function ssfaMtrSrchDiag_selectOwnerDeptName(items) {
        $("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_code").val(items[0].data.department_cd);
        $("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_name").val(items[0].data.department_name);
        $("#" + ssfaMtrSrchDiag_partsId + "_owner_comp_cd").val(items[0].data.company_cd);
        $("#" + ssfaMtrSrchDiag_partsId + "_owner_dept_set_cd").val(items[0].data.department_set_cd);
    }
    
    /**
     * ユーザ選択ダイアログのコールバック関数です。(主担当者)
     *
     * @param items
     *            選択ユーザ情報
     */
    function ssfaMtrSrchDiag_selectMainOwnerUserName(items) {
        $("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_name").val(items[0].data.user_name);
        $("#" + ssfaMtrSrchDiag_partsId + "_im_main_owner_user_cd").val(items[0].data.user_cd);
    }

   

