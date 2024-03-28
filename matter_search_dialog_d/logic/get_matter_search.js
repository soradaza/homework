/**
 * @file 案件検索
 * @author INTRAMART
 * @version 8.0.0
 */

/* logger */
let logger = Logger.getLogger(SsfaConst.APPLICATION_LOG_ID);

/**
 * 案件情報の検索を実施します。
 *
 * @param param
 *            CSJSから渡された入力項目
 * @return 案件一覧
 */
function getMatterSearch(param) {
	Debug.console(param);
	// 省略パラメータを補完
	SsfaCommon.makeDefaultParams(param.conditions);
	if (param.conditions.details == null) {
		param.conditions.details = {};
	}
	if (isBlank(param.conditions.order_by)) {
		param.conditions.order_by = "m_record_date desc";
	}
	
	// 入力チェック
	let check = inputCheck(param.conditions.details);
	if (check.error) {
		return check;
	}
	// 参照組織情報の取得
	let targetDept = null;
	if (param.conditions.details.owner_comp_cd && param.conditions.details.owner_dept_set_cd && param.conditions.details.owner_dept_cd) {
		targetDept = {
			companyCd : param.conditions.details.owner_comp_cd,
			departmentSetCd : param.conditions.details.owner_dept_set_cd,
			departmentCd : param.conditions.details.owner_dept_cd};
	}
	let searchTargetDept = SsfaCommon.getSearchTargetDept(param.conditions.details.dept_flag, targetDept, param.conditions.target_date);
	if (searchTargetDept.error) {
		return outputError(searchTargetDept);
	}
	if (searchTargetDept.data.owner_dept_cds != null && searchTargetDept.data.owner_dept_cds.length == 0) {

		// 閲覧組織できる組織がない場合は0件
		return {
			error : false,
			errorMessage : null,
			data : {
				"matter_info": [],
				"count_all": 0
			}
		};
	}

	// 自担当検索
	let owner_user_cd = null;
	let accountContext = Contexts.getAccountContext();
	if (!isBlank(param.conditions.details.owner_flag)) {
		owner_user_cd = accountContext.userCd;
	}
	// 主担当者フラグを整形
	let main_owner_flag = null;
	if(!isBlank(param.conditions.details.main_user_flag)){
		main_owner_flag = SsfaConst.FLAG_ON;
	}
	// 主担当組織フラグを整形
	let main_owner_dept_flag = null;
	if(!isBlank(param.conditions.details.main_owner_dept_flag)){
		main_owner_dept_flag = SsfaConst.FLAG_ON;
	}
	
	let dept_flag = null;
	if(!isBlank(param.conditions.details.dept_flag)){
		dept_flag = SsfaConst.FLAG_ON;
	}
	// 重要フラグを整形
	let important_flag = null;
	if(!isBlank(param.conditions.details.important_flag)){
		important_flag = SsfaConst.FLAG_ON;
	}
	// 工事フラグを整形
	let construction_flag = null;
	if(!isBlank(param.conditions.details.construction_flag)){
		construction_flag = SsfaConst.FLAG_ON;
	}
	// 非公開フラグを整形
	let hidden_flag = null;
	if(!isBlank(param.conditions.details.hidden_flag)){
		hidden_flag = SsfaConst.FLAG_ON;
	}
	// 内部取引区分フラグを整形
	let internal_biz_flag = null;
	if(!isBlank(param.conditions.details.internal_biz_flag)){
		internal_biz_flag = SsfaConst.FLAG_ON;
	}
	//注力フラグを整形
	let focus_flag = null;
	if(!isBlank(param.conditions.details.focus_flag)){
		focus_flag = SsfaConst.FLAG_ON;
	}
	//仮状態フラグを整形
	let provisional_status = null;
	if(!isBlank(param.conditions.details.provisional_status)){
		provisional_status = SsfaConst.FLAG_ON;
	}
	//完了フラグを整形
	let complete_flag = null;
	if (!isBlank(param.conditions.details.complete_flag)) {
		complete_flag = param.conditions.details.complete_flag.split(",");
	}

	// 権限チェック
	let authRes = SsfaCommon.getUserAuth();
	if ( authRes.error ) {
		return authRes;
	}

	let authSql1 = null;　
	let authSql2 = null;
	if ( ! authRes.data[ SsfaConst.AUTH_ROLE_ALL_ACCESS_USER ] ){
		
		// 管理者権限がない場合、非公開設定を条件に追加
		let authSqlRes = SsfaAuthority.isReferenceSql( SsfaConst.AUTHORITY_PROCESS_ID_MATTER  );  
		if ( authSqlRes.error ) {
			return authSqlRes;
		}
		authSql1 = authSqlRes.data[0];
		authSql2 = authSqlRes.data[1];
	}

	// 主担当者グループタイプ
	let imMainOwnerUserGroupTypePri = null;
	let imMainOwnerUserGroupTypePub = null;
	switch (param.conditions.details.im_main_owner_user_group_type) {
		case 'imm_private_grp':
			imMainOwnerUserGroupTypePri = "1";
			break;
		case 'imm_public_grp':
			imMainOwnerUserGroupTypePub = "1";
			break;
		default:
	}

	// 作成者グループタイプ
	let createUserGroupTypePri = null;
	let createUserGroupTypePub = null;
	switch (param.conditions.details.create_user_group_type) {
		case 'imm_private_grp':
			createUserGroupTypePri = "1";
			break;
		case 'imm_public_grp':
			createUserGroupTypePub = "1";
			break;
		default:
	}

	// 案件一覧件数取得　パラメータ　使わないパラム削除
	let sysLimit = ScmnSystemParameter.getValue ( SsfaConst.SSFA_MATTER_LIST_LIMIT ); // シスパラ：検索上限件数取得
	let searchWhereItems = SsfaCommon.pageToDbDateFormat(param.conditions.details, {
		//dateformatlist 日付のみ修正　ヴァリデーションできているかチェック
		dateFormatList : ["receive_plan_date_from","receive_plan_date_to","sales_plan_date_from","sales_plan_date_to","matter_update_date_from", "matter_update_date_to"]});
		searchWhereItems = SsfaCommon.replaceObjectValues(searchWhereItems, {
			own_dept_flag : param.conditions.details.own_dept_flag  === SsfaConst.FLAG_ON ? true : false,
		self_charge_flag : param.conditions.details.self_charge_flag === SsfaConst.FLAG_ON ? true : false,
		
		owner_comp_cd : searchTargetDept.data.owner_comp_cd,
		owner_dept_set_cd : searchTargetDept.data.owner_dept_set_cd,
		owner_dept_code : param.conditions.details.owner_dept_code,
		owner_dept_cd : param.conditions.details.owner_dept_code,
		owner_dept_cds : searchTargetDept.data.owner_dept_cds,
		owner_dept_name : param.conditions.details.owner_dept_name,
		
		im_main_owner_user_cd : param.conditions.details.im_main_owner_user_cd,
		im_main_owner_user_name : param.conditions.details.im_main_owner_user_name,
		
		im_owner_user_cd : param.conditions.details.im_owner_user_cd,
		im_owner_user_name : param.conditions.details.im_owner_user_name,
		
		create_user_code : param.conditions.details.create_user_code,
		create_user_name : param.conditions.details.create_user_name,
		
		divide_type : param.conditions.details.divide_type,

		
		
		partner_dept_code : param.conditions.details.partner_dept_code,
		
		partner_dept_name : param.conditions.details.partner_dept_name,
		
		im_partner_user_cd : param.conditions.details.im_partner_user_cd,
		im_partner_user_name : param.conditions.details.im_partner_user_name,
		
		im_main_owner_user_group_name : param.conditions.details.im_main_owner_user_group_name,
		im_main_owner_user_group_type : param.conditions.details.im_main_owner_user_group_type,
		im_main_owner_user_group_type_private : imMainOwnerUserGroupTypePri,
		im_main_owner_user_group_type_public  : imMainOwnerUserGroupTypePub,
		im_main_owner_user_public_group_set_cd : param.conditions.details.im_main_owner_user_public_group_set_cd,
		im_main_owner_user_group_code : param.conditions.details.im_main_owner_user_group_code,
		
		im_owner_user_group_name : param.conditions.details.im_owner_user_group_name,
		im_owner_user_group_type : param.conditions.details.im_owner_user_group_type,
		im_owner_user_public_group_set_cd : param.conditions.details.im_owner_user_public_group_set_cd,
		im_owner_user_group_code : param.conditions.details.im_owner_user_group_code,
		
		create_user_group_name : param.conditions.details.create_user_group_name,
		create_user_group_type : param.conditions.details.create_user_group_type,
		create_user_group_type_private : createUserGroupTypePri,
		create_user_group_type_public  : createUserGroupTypePub,
		create_user_public_group_set_cd : param.conditions.details.create_user_public_group_set_cd,
		create_user_group_code : param.conditions.details.create_user_group_code,
		
		sales_cstmr_corp_cd : param.conditions.details.sales_cstmr_corp_cd,
		sales_cstmr_corp_name : param.conditions.details.sales_cstmr_corp_name,
		sales_cstmr_base_cd : param.conditions.details.sales_cstmr_base_cd,
		sales_cstmr_base_name : param.conditions.details.sales_cstmr_base_name,
		sales_cstmr_dept_internal_cd : param.conditions.details.sales_cstmr_dept_internal_cd,
		sales_cstmr_dept_internal_name : param.conditions.details.sales_cstmr_dept_internal_name,
		sales_cstmr_dept_internal_comp_cd : param.conditions.details.sales_cstmr_dept_internal_comp_cd,
		sales_cstmr_dept_internal_dept_set_cd : param.conditions.details.sales_cstmr_dept_internal_dept_set_cd,
		sales_cstmr_dept_normal_name : param.conditions.details.sales_cstmr_dept_normal_name,
		sales_cstmr_person_internal_cd : param.conditions.details.sales_cstmr_person_internal_cd,
		sales_cstmr_person_internal_name : param.conditions.details.sales_cstmr_person_internal_name,
		sales_cstmr_person_normal_name : param.conditions.details.sales_cstmr_person_normal_name,
		sales_cstmr_person_normal_sys_person_id : param.conditions.details.sales_cstmr_person_normal_sys_person_id,
		
		target_cstmr_corp_cd : param.conditions.details.target_cstmr_corp_cd,
		target_cstmr_corp_name : param.conditions.details.target_cstmr_corp_name,
		target_cstmr_corp_id : param.conditions.details.target_cstmr_corp_id,
		target_cstmr_base_cd : param.conditions.details.target_cstmr_base_cd,
		target_cstmr_base_name : param.conditions.details.target_cstmr_base_name,
		target_cstmr_base_id : param.conditions.details.target_cstmr_base_id,
		target_cstmr_dept_internal_cd : param.conditions.details.target_cstmr_dept_internal_cd,
		target_cstmr_dept_internal_name : param.conditions.details.target_cstmr_dept_internal_name,
		target_cstmr_dept_internal_comp_cd : param.conditions.details.target_cstmr_dept_internal_comp_cd,
		target_cstmr_dept_internal_dept_set_cd : param.conditions.details.target_cstmr_dept_internal_dept_set_cd,
		target_cstmr_dept_normal_name : param.conditions.details.target_cstmr_dept_normal_name,
		target_cstmr_person_internal_cd : param.conditions.details.target_cstmr_person_internal_cd,
		target_cstmr_person_internal_name : param.conditions.details.target_cstmr_person_internal_name,
		target_cstmr_person_normal_name : param.conditions.details.target_cstmr_person_normal_name,
		target_cstmr_person_normal_sys_person_id : param.conditions.details.target_cstmr_person_normal_sys_person_id,
		
		target_cstmr_nb_corp_cd : param.conditions.details.target_cstmr_nb_corp_cd,
		target_cstmr_nb_corp_name : param.conditions.details.target_cstmr_nb_corp_name,
		target_cstmr_nb_corp_id : param.conditions.details.target_cstmr_nb_corp_id,
		target_cstmr_nb_base_cd : param.conditions.details.target_cstmr_nb_base_cd,
		target_cstmr_nb_base_name : param.conditions.details.target_cstmr_nb_base_name,
		target_cstmr_nb_base_id : param.conditions.details.target_cstmr_nb_base_id,
		target_cstmr_nb_dept_internal_cd : param.conditions.details.target_cstmr_nb_dept_internal_cd,
		target_cstmr_nb_dept_internal_name : param.conditions.details.target_cstmr_nb_dept_internal_name,
		target_cstmr_nb_dept_internal_comp_cd : param.conditions.details.target_cstmr_nb_dept_internal_comp_cd,
		target_cstmr_nb_dept_internal_dept_set_cd : param.conditions.details.target_cstmr_nb_dept_internal_dept_set_cd,
		target_cstmr_nb_dept_normal_name : param.conditions.details.target_cstmr_nb_dept_normal_name,
		target_cstmr_nb_person_internal_cd : param.conditions.details.target_cstmr_nb_person_internal_cd,
		target_cstmr_nb_person_internal_name : param.conditions.details.target_cstmr_nb_person_internal_name,
		target_cstmr_nb_person_normal_name : param.conditions.details.target_cstmr_nb_person_normal_name,
		target_cstmr_nb_person_normal_sys_person_id : param.conditions.details.target_cstmr_nb_person_normal_sys_person_id,
		
		industry_cd : param.conditions.details.industry_cd,
		industry_name : param.conditions.details.industry_name,
		process_cd : param.conditions.details.process_cd,
		process_name : param.conditions.details.process_name,
		facility_cd : param.conditions.details.facility_cd,
		facility_name : param.conditions.details.facility_name,
		
		matter_cstmr_user_name : param.conditions.details.matter_cstmr_user_name,
		sys_person_id : param.conditions.details.sys_person_id,
		
		supp_type_cd : param.conditions.details.supp_type_cd,
		supp_type_name : param.conditions.details.supp_type_name,
		supp_cd : param.conditions.details.supp_cd,
		supp_name : param.conditions.details.supp_name,
		
		item_cd : param.conditions.details.item_cd,
		item : param.conditions.details.item,
		item_conv_cd : param.conditions.details.item_conv_cd,
		item_name : param.conditions.details.item_name,
		order_item_name : param.conditions.details.order_item_name,
		
		important_flag : param.conditions.details.important_flag,
		construction_flag : param.conditions.details.construction_flag,
		hidden_flag : param.conditions.details.hidden_flag,
		internal_biz_flag : param.conditions.details.internal_biz_flag,
		focus_flag : param.conditions.details.focus_flag,
		provisional_status : param.conditions.details.provisional_status,
		nk_type : SsfaCommon.parseCheckboxInputValues(param.conditions.details.nk_type),

		matter_no : param.conditions.details.matter_no,
		matter_name : param.conditions.details.matter_name,
		description : param.conditions.details.description,
		matter_dtl_no : param.conditions.details.matter_dtl_no,
		matter_dtl_name : param.conditions.details.matter_dtl_name,
		dtl_description : param.conditions.details.dtl_description,
		
		trigger : param.conditions.details.trigger,
		construction_no : param.conditions.details.construction_no,
		sprice : param.conditions.details.sprice,
		gross_sprofit : param.conditions.details.gross_sprofit,
		
		gap_handle_matter_type_cd : param.conditions.details.gap_handle_matter_type_cd,
		gap_handle_matter_manager_type_cd : param.conditions.details.gap_handle_matter_manager_type_cd,
		campaign_name : param.conditions.details.campaign_name,
		imfr_campaign_id : param.conditions.details.imfr_campaign_id,
		estimate_no : param.conditions.details.estimate_no,
		va_sales_ex_type_cd : param.conditions.details.va_sales_ex_type_cd,
		va_sales_ex_no : param.conditions.details.va_sales_ex_no,
		
		matter_status1_cd : SsfaCommon.parseCheckboxInputValues(param.conditions.details.matter_status1_cd),
		matter_status2_cd : SsfaCommon.parseCheckboxInputValues(param.conditions.details.matter_status2_cd),
		
		
		reliability_type_cd : SsfaCommon.parseCheckboxInputValues(param.conditions.details.reliability_type_cd),
		bantc_b : param.conditions.details.bantc_b,
		bantc_a : param.conditions.details.bantc_a,
		bantc_n : param.conditions.details.bantc_n,
		bantc_t : param.conditions.details.bantc_t,
		bantc_c : param.conditions.details.bantc_c,
		
		matter_id : param.conditions.details.matter_id,

		login_user_cd : accountContext.userCd,
		locale_id : param.conditions.locale_id,
		target_date : param.conditions.target_date,
		application_id : param.conditions.application_id,
		authority_query1 : authSql1,
		authority_query2 : authSql2,
		order_by : null,
		offset : param.conditions.offset, 
		limit : param.conditions.limit
		
	});
	//案件件数取得　
	let matterListCnt = SsfaDbTableAccess.executeSelect(SsfaConst.PATH_DIALOG_MATTER_SEARCH_D, "get_matter_search_count", searchWhereItems);
	if (matterListCnt.error) { 
	return outputError(matterListCnt);
	}
	
	
	
	// 案件一覧取得	
	searchWhereItems.order_by = param.conditions.order_by;
	let matterList = SsfaDbTableAccess.executeSelect(SsfaConst.PATH_DIALOG_MATTER_SEARCH_D, "get_matter_search", searchWhereItems);
	
	if (matterList.error) {
		return outputError(matterList);
	}

	// 返却用に日付書式変換
	let matterListData = SsfaCommon.dbToPageDateFormat(matterList.data, {
		dateTimestampSSSFormatList : ["c_create_date", "m_create_date"]
	});

// 案件一覧編集
	let resultMtterList = SsfaCommon.dbToPageDateFormat(matterList.data, 
		{dateFormatList : ["receive_plan_year_month_date", "sales_plan_year_month_date"], dateTimeFormatList : ["matter_update_date", "record_date"]});
	return {
		error : false,
		
		errorMessage : null,
		data : {
			matter_info: resultMtterList,
			count_all: matterListCnt.data[0].count_all
		}
	};
}

/**
 * エラー発生時のログ出力を実施します。
 *
 * @param result
 *            API/関数の呼び出し結果
 * @return CSJS返却用エラー情報
 */
function outputError(result) {
	logger.error(MessageManager.getMessage("E.SSFA.0006",
		MessageManager.getMessage("CAP.Z.SSFA.MATTER"), result.errorMessage));
	return {
		error : true,
		errorMessage : MessageManager.getMessage("MSG.E.SSFA.SEARCH.FAILURE"),
		data : null };
}

/**
 * 案件一覧検索時の入力チェックを実施します。
 *
 * @param param
 *            CSJSから渡された入力項目
 * @return 入力チェック結果
 */
function inputCheck(param) {
	let messages = SsfaInputCheck.inputCheck([param], "ssfa/pages/parts/dialog_parts/search_parts/matter_search_dialog_d/validator/matter_search_dialog_d#conditions", MessageManager.getMessage("CAP.Z.RSFA.MATTER_LIST.MATTER_LIST"));
	if (messages.length > 0) {
		return {
			error : true,
			errorMessage : MessageManager.getMessage("MSG.E.RSFA.MATTER_LIST.INPUTCHECK.ERROR"),
			data : {messages : messages}};
	} else {
		return {
			error : false,
			errorMessage : null,
			data : null};
	}
}


