/*IF authority_query1 != null*/
/*$authority_query1.getData()*/
/*END*/
SELECT
    count(1) AS count_all 
FROM
    ( 
                SELECT
                    rtmed.receive_plan_year_month_date AS receive_plan_year_month_date
                    , rtmed.sales_plan_year_month_date AS sales_plan_year_month_date
                    , imd1.department_name AS dept_name
                    , imu1.user_name AS im_main_owner_user_name
                    , hidden_item.matter_dtl_name AS matter_dtl_name
					, rtme.sales_cstmr_corp_name AS sales_cstmr_corp_name 
                    , hidden_item.target_cstmr_corp_name AS target_cstmr_corp_name
                    , smc1.name AS matter_status1_name
                    , smc2.name AS matter_status2_name
                    , rtmed.matter_status1_cd AS matter_status1_cd
            		, rtmed.matter_status2_cd AS matter_status2_cd
                    , smc5.name AS reliability_type_name
                    , rtmed.bant_cond_total AS bant_cond_total
                    , hidden_item.supp_name AS supplier
                    , rtmei.sprice AS sprice
                    , rtmei.gross_sprofit AS gross_sprofit
                    , rtmed.declare_oprice AS declare_oprice
                    , rtmed.declare_gross_oprofit AS declare_gross_oprofit
                    , rtmed.divide_rate AS divide_rate
                    , imd2.department_name AS partner_dept_name
                    , imu4.user_name AS partner_user_name
                    , rtme.matter_update_date AS matter_update_date
                    , imu7.user_name AS matter_update_user_name
                    , stm.record_date AS record_date
                    , imu6.user_name AS record_user_name
                    , stm.matter_id AS matter_id 
                    , stm.matter_name AS matter_name
                    , stm.hidden_flag AS hidden_flag
                    , rtmed.focus_flag AS focus_flag
                    , stm.matter_no AS matter_no
                FROM
                    ssfa_t_matter stm 
                    LEFT JOIN rsfa_t_matter_ex rtme -- 案件拡張
                        ON rtme.matter_id = stm.matter_id 
                        AND rtme.application_id = /*application_id*/'ssfa' 
                        AND rtme.delete_flag = '0' 
                    LEFT JOIN rsfa_t_matter_ex_dtl rtmed -- 案件拡張詳細
                        ON rtmed.matter_id = stm.matter_id 
                        AND rtmed.application_id = /*application_id*/'ssfa' 
                        AND rtmed.delete_flag = '0' 
                    LEFT JOIN rsfa_t_matter_ex_item rtmei -- 案件拡張商品
                        ON rtmei.matter_id = rtmed.matter_id 
                        AND rtmei.matter_dtl_id = rtmed.matter_dtl_id 
                        AND rtmei.application_id = /*application_id*/'ssfa' 
                        AND rtmei.delete_flag = '0' 
                    LEFT JOIN rsfa_t_matter_ex_item_dtl rtmeid -- 案件拡張商品明細
                        ON rtmeid.matter_id = rtmei.matter_id 
                        AND rtmeid.application_id = /*application_id*/'ssfa' 
                        AND rtmeid.delete_flag = '0' 
                    LEFT JOIN scmn_m_cd smc1    -- コードマスタ(案件状態1)
                        ON smc1.cd_type = 'RSFA_MATTER_STATUS1_CD' 
                        AND smc1.cd = rtmed.matter_status1_cd 
                        AND smc1.start_date <= /*target_date*/'2018/10/17' 
                        AND smc1.end_date > /*target_date*/'2018/10/17' 
                        AND smc1.application_id = /*application_id*/'ssfa' 
                        AND smc1.locale_id = /*locale_id*/'ja' 
                    LEFT JOIN scmn_m_cd smc2    -- コードマスタ(案件状態2)
                        ON smc2.cd_type = 'RSFA_MATTER_STATUS2_CD' 
                        AND smc2.cd = rtmed.matter_status2_cd 
                        AND smc2.start_date <= /*target_date*/'2018/10/17' 
                        AND smc2.end_date > /*target_date*/'2018/10/17' 
                        AND smc2.application_id = /*application_id*/'ssfa' 
                        AND smc2.locale_id = /*locale_id*/'ja' 
                    LEFT JOIN scmn_m_cd smc5    -- コードマスタ(案件確度)
                        ON smc5.cd_type = 'SSFA_RELIABILITY_TYPE_CD' 
                        AND smc5.cd = stm.reliability_type_cd 
                        AND smc5.start_date <= /*target_date*/'2018/10/17' 
                        AND smc5.end_date > /*target_date*/'2018/10/17' 
                        AND smc5.application_id = /*application_id*/'ssfa' 
                        AND smc5.locale_id = /*locale_id*/'ja' 
                    LEFT JOIN imm_user imu1     -- ユーザ(主担当)
                        ON imu1.user_cd = rtme.im_main_owner_user_cd 
                        AND imu1.locale_id = /*locale_id*/'ja' 
                        AND imu1.start_date <= /*target_date*/'2018/10/17' 
                        AND imu1.end_date > /*target_date*/'2018/10/17' 
                    LEFT JOIN imm_user imu4     -- ユーザ(相手担当)
                        ON imu4.user_cd = rtmed.im_to_user_cd 
                        AND imu4.locale_id = /*locale_id*/'ja' 
                        AND imu4.start_date <= /*target_date*/'2018/10/17' 
                        AND imu4.end_date > /*target_date*/'2018/10/17' 
                    LEFT JOIN imm_user imu6     -- ユーザ(更新者)
                        ON imu6.user_cd = stm.record_user_cd 
                        AND imu6.locale_id = /*locale_id*/'ja' 
                        AND imu6.start_date <= /*target_date*/'2018/10/17' 
                        AND imu6.end_date > /*target_date*/'2018/10/17' 
                    LEFT JOIN imm_user imu7     -- ユーザ(案件修正者)
                        ON imu7.user_cd = rtme.matter_user_cd 
                        AND imu7.locale_id = /*locale_id*/'ja' 
                        AND imu7.start_date <= /*target_date*/'2018/10/17' 
                        AND imu7.end_date > /*target_date*/'2018/10/17' 
                    LEFT JOIN imm_department imd1 -- 組織(主担当部署)
                        ON imd1.company_cd = rtme.im_owner_comp_cd 
                        AND imd1.department_set_cd = rtme.im_owner_dept_set_cd 
                        AND imd1.department_cd = rtme.im_owner_dept_cd 
                        AND imd1.locale_id = /*locale_id*/'ja' 
                        AND imd1.start_date <= /*target_date*/'2018/10/17' 
                        AND imd1.end_date > /*target_date*/'2018/10/17' 
                    LEFT JOIN imm_department imd2 -- 組織(相手部署)
                        ON imd2.company_cd = rtmed.im_to_comp_cd 
                        AND imd2.department_set_cd = rtmed.im_to_dept_set_cd 
                        AND imd2.department_cd = rtmed.im_to_dept_cd 
                        AND imd2.locale_id = /*locale_id*/'ja' 
                        AND imd2.start_date <= /*target_date*/'2018/10/17' 
                        AND imd2.end_date > /*target_date*/'2018/10/17' 
                    LEFT JOIN ( --非公開項目は個別で取得
                        SELECT
                            stm.matter_id
                            , ncc1.customer_cd AS sales_cstmr_customer_cd
                            , CASE WHEN rtme.sales_cstmr_corp_name IS NULL THEN ncc1.customer_name ELSE rtme.sales_cstmr_corp_name END AS sales_cstmr_corp_name
                            , ncc2.customer_branch_cd AS sales_cstmr_customer_branch_cd
                            , ncc2.customer_name AS sales_cstmr_base_name
                            , rtme.sales_cstmr_comp_cd_internal AS sales_cstmr_comp_cd_internal
                            , rtme.sales_cstmr_dept_set_cd_internal AS sales_cstmr_dept_set_cd_internal
                            , rtme.sales_cstmr_dept_cd_internal AS sales_cstmr_dept_cd_internal
                            , imd1.department_name AS sales_cstmr_dept_internal_name
                            , rtme.sales_cstmr_dept_name_normal AS sales_cstmr_dept_name_normal
                            , imu2.user_cd AS sales_cstmr_person_internal_cd
                            , imu2.user_name AS sales_cstmr_person_internal_name
                            , rtme.sales_cstmr_person_id_normal AS sales_cstmr_person_normal_sys_person_id
                            , smp1.user_name AS sales_cstmr_person_normal_name
                            , ncc3.customer_cd AS target_cstmr_customer_cd
                            , CASE WHEN rtme.sales_cstmr_corp_name IS NULL THEN ncc3.customer_name ELSE rtme.sales_cstmr_corp_name END AS target_cstmr_corp_name
                            , ncc4.customer_branch_cd AS target_cstmr_customer_branch_cd
                            , ncc4.customer_name AS target_cstmr_base_name
                            , rtme.target_cstmr_comp_cd_internal AS target_cstmr_comp_cd_internal
                            , rtme.target_cstmr_dept_set_cd_internal AS target_cstmr_dept_set_cd_internal
                            , rtme.target_cstmr_dept_cd_internal AS target_cstmr_dept_cd_internal
                            , imd2.department_name AS target_cstmr_dept_internal_name                           
                            , rtme.target_cstmr_dept_name_normal AS target_cstmr_dept_name_normal
                            , imu5.user_cd AS target_cstmr_person_internal_cd
                            , imu5.user_name AS target_cstmr_person_internal_name
                            , rtme.target_cstmr_person_id_normal AS target_cstmr_person_normal_sys_person_id
                            , smp2.user_name AS target_cstmr_person_normal_name
                            , stm.matter_name AS matter_name
                            , rtmed.matter_dtl_name AS matter_dtl_name
                            , rtmeid.supp_name AS supp_name
                        FROM ssfa_t_matter stm
                        LEFT JOIN rsfa_t_matter_ex rtme
                            ON stm.matter_id = rtme.matter_id
                        LEFT JOIN rsfa_t_matter_ex_dtl rtmed
                            ON stm.matter_id = rtmed.matter_id
                            AND rtmed.application_id = /*application_id*/'ssfa' 
                            AND rtmed.delete_flag = '0'
                        LEFT JOIN rsfa_t_matter_ex_item_dtl rtmeid
                            ON stm.matter_id = rtmeid.matter_id
                            AND rtmeid.application_id = /*application_id*/'ssfa' 
                            AND rtmeid.delete_flag = '0'
                        LEFT JOIN ssfa_t_matter_user stmu
                            ON stm.matter_id = stmu.matter_id
                            AND stmu.application_id = /*application_id*/'ssfa' 
                            AND stmu.delete_flag = '0'
                        LEFT JOIN ncrm_comm_customer ncc1 -- 顧客共通マスタ（売上顧客得意先コード）
                           ON ncc1.customer_id = CAST(rtme.sales_cstmr_corp_id AS NUMERIC)
                        LEFT JOIN ncrm_comm_customer ncc2 -- 顧客共通マスタ（売上顧客得意先拠点コード）
                            ON ncc2.customer_id = CAST(rtme.sales_cstmr_base_id AS NUMERIC)
                        LEFT JOIN ncrm_comm_customer ncc3 -- 顧客共通マスタ（ターゲット顧客得意先コード）
                            ON ncc3.customer_id = CAST(rtme.target_cstmr_corp_id AS NUMERIC)
                        LEFT JOIN ncrm_comm_customer ncc4 -- 顧客共通マスタ（ターゲット顧客得意先拠点コード）
                            ON ncc4.customer_id = CAST(rtme.target_cstmr_base_id AS NUMERIC)
                        LEFT JOIN imm_user imu2     -- ユーザ(売上顧客担当者 内部)
                            ON imu2.user_cd = rtme.sales_cstmr_user_cd_internal 
                            AND imu2.locale_id = /*locale_id*/'ja' 
                            AND imu2.start_date <= /*target_date*/'2018/10/17' 
                            AND imu2.end_date > /*target_date*/'2018/10/17' 
                        LEFT JOIN imm_user imu5     -- ユーザ(ターゲット顧客担当者 内部)
                            ON imu5.user_cd = rtme.target_cstmr_user_cd_internal 
                            AND imu5.locale_id = /*locale_id*/'ja' 
                            AND imu5.start_date <= /*target_date*/'2018/10/17' 
                            AND imu5.end_date > /*target_date*/'2018/10/17' 
                        LEFT JOIN imm_department imd1 -- 組織(売上顧客部署 内部)
                            ON imd1.company_cd = rtme.sales_cstmr_comp_cd_internal
                            AND imd1.department_set_cd = rtme.sales_cstmr_dept_set_cd_internal
                            AND imd1.department_cd = rtme.sales_cstmr_dept_cd_internal
                            AND imd1.start_date <= /*target_date*/'2019/01/01'
                            AND imd1.end_date > /*target_date*/'2019/01/01' 
                            AND imd1.locale_id =  /*locale_id*/'ja'
                        LEFT JOIN imm_department imd2 -- 組織(ターゲット顧客部署 内部)
                            ON imd2.company_cd = rtme.target_cstmr_comp_cd_internal
                            AND imd2.department_set_cd = rtme.target_cstmr_dept_set_cd_internal
                            AND imd2.department_cd = rtme.target_cstmr_dept_cd_internal
                            AND imd2.start_date <= /*target_date*/'2019/01/01'
                            AND imd2.end_date > /*target_date*/'2019/01/01' 
                            AND imd2.locale_id =  /*locale_id*/'ja'
                        LEFT JOIN ssfa_m_person smp1 -- パーソン(売上顧客担当者 通常)
                            ON smp1.sys_person_id = rtme.sales_cstmr_person_id_normal
                            AND smp1.locale_id = /*locale_id*/'ja' 
                            AND smp1.start_date <= /*target_date*/'2018/10/17' 
                            AND smp1.end_date > /*target_date*/'2018/10/17' 
                        LEFT JOIN ssfa_m_person smp2 -- パーソン(ターゲット顧客担当者 通常)
                            ON smp2.sys_person_id = rtme.target_cstmr_person_id_normal 
                            AND smp2.locale_id = /*locale_id*/'ja' 
                            AND smp2.start_date <= /*target_date*/'2018/10/17' 
                            AND smp2.end_date > /*target_date*/'2018/10/17' 
                        WHERE
                            stm.application_id = /*application_id*/'ssfa' 
                            AND stm.delete_flag = '0'
                            /*IF authority_query2 != null*/
                                AND /*$authority_query2.getData()*/
                            /*END*/
                        GROUP BY
                            stm.matter_id
                            , ncc1.customer_cd
                            , rtme.sales_cstmr_corp_id
                            , rtme.sales_cstmr_corp_name
                            , ncc1.customer_name
                            , ncc2.customer_branch_cd
                            , ncc2.customer_name
                            , rtme.sales_cstmr_comp_cd_internal
                            , rtme.sales_cstmr_dept_set_cd_internal
                            , rtme.sales_cstmr_dept_cd_internal
                            , imd1.department_name
                            , rtme.sales_cstmr_dept_name_normal
                            , imu2.user_cd
                            , imu2.user_name
                            , rtme.sales_cstmr_person_id_normal
                            , smp1.user_name
                            , ncc3.customer_cd
                            , rtme.target_cstmr_corp_id
                            , rtme.target_cstmr_corp_name
                            , ncc3.customer_name
                            , ncc4.customer_branch_cd
                            , ncc4.customer_name
                            , rtme.target_cstmr_comp_cd_internal
                            , rtme.target_cstmr_dept_set_cd_internal
                            , rtme.target_cstmr_dept_cd_internal
                            , imd2.department_name                           
                            , rtme.target_cstmr_dept_name_normal
                            , imu5.user_cd
                            , imu5.user_name
                            , rtme.target_cstmr_person_id_normal
                            , smp2.user_name
                            , stm.matter_name
                            , rtmed.matter_dtl_name
                            , rtmeid.supp_name
                    ) hidden_item
                        ON hidden_item.matter_id = stm.matter_id
                    
                    LEFT JOIN ssfa_t_matter_user stmu  -- 案件担当者
                        ON stmu.matter_id = stm.matter_id 
                        AND stmu.delete_flag = '0' 
                        AND stmu.application_id = /*application_id*/'ssfa'  
                
                WHERE
                    stm.application_id = /*application_id*/'ssfa' 
                    AND stm.delete_flag = '0'   -- 担当部署
                    -- 自部署フラグの値がTRUEの時
                /*IF own_dept_flag == true*/
                    /*IF owner_comp_cd != null*/
                    AND rtme.im_owner_comp_cd = /*owner_comp_cd*/'' 
                    /*END*/
                    /*IF owner_dept_set_cd != null*/
                    AND rtme.im_owner_dept_set_cd = /*owner_dept_set_cd*/'' 
                    /*END*/
                    /*IF owner_dept_cds != null*/
                    AND rtme.im_owner_dept_cd IN /*owner_dept_cds*/('') 
                    /*END*/
                    /*IF owner_dept_cds == null && owner_dept_code != null*/
                    AND rtme.im_owner_dept_cd = /*owner_dept_code*/'' 
                    /*END*/
                /*END*/
                    -- 自部署フラグの値がFALSE、かつ、検索条件.担当者部署コードの値が入力されている時
                /*IF own_dept_flag == false && owner_dept_code != null*/
                    /*IF owner_comp_cd != null*/
                    AND rtme.im_owner_comp_cd = /*owner_comp_cd*/'' 
                    /*END*/
                    /*IF owner_dept_set_cd != null*/
                    AND rtme.im_owner_dept_set_cd = /*owner_dept_set_cd*/'' 
                    /*END*/
                    /*IF owner_dept_cds != null*/
                    AND rtme.im_owner_dept_cd IN /*owner_dept_cds*/('') 
                    /*END*/
                    /*IF owner_dept_cds == null && owner_dept_cd != null*/
                    AND rtme.im_owner_dept_cd = /*owner_dept_cd*/'' 
                    /*END*/
                /*END*/
                    -- 自部署フラグの値がFALSE、かつ、検索条件.担当者部署のみが入力されている時
                /*IF own_dept_flag == false && owner_dept_code == null && owner_dept_name != null*/
                    AND imd1.department_name LIKE '%' /*$sql_concat*/|| /*owner_dept_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                    -- 主担当者
                    -- 自担当フラグの値がTRUEの時
                /*IF self_charge_flag == true*/
                    AND rtme.im_main_owner_user_cd = /*login_user_cd*/'' 
                /*END*/
                    --自担当フラグの値がFALSE、かつ、検索条件.担当者コードの値が入力されている時
                /*IF self_charge_flag == false && im_main_owner_user_cd != null*/
                    AND rtme.im_main_owner_user_cd = /*im_main_owner_user_cd*/'' 
                /*END*/
                    --自担当フラグの値がFALSE、かつ、検索条件.担当者のみが入力されている時
                /*IF self_charge_flag == false && im_main_owner_user_cd == null && im_main_owner_user_name != null*/
                    AND imu1.user_name LIKE '%' /*$sql_concat*/|| /*im_main_owner_user_name*/'' /*$sql_concat*/|| '%' 
                /*END*/


                    -- 相手担当者
                /*IF im_partner_user_cd != null*/
                    AND rtmed.im_to_user_cd = /*im_partner_user_cd*/'' 
                /*END*/
                /*IF im_partner_user_cd == null && im_partner_user_name != null*/
                    AND imu4.user_name LIKE '%' /*$sql_concat*/|| /*im_partner_user_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                    -- 売上顧客
                -- 得意先
                /*IF sales_cstmr_corp_cd != null*/
                    AND hidden_item.sales_cstmr_customer_cd = /*sales_cstmr_corp_cd*/'' 
                /*END*/
                /*IF sales_cstmr_corp_cd == null && sales_cstmr_corp_name != null*/
                    AND ssfa_varchar_normalze(hidden_item.sales_cstmr_corp_name) LIKE '%' /*$sql_concat*/|| ssfa_varchar_normalze(/*sales_cstmr_corp_name*/'') /*$sql_concat*/|| '%' 
                /*END*/
                -- 得意先拠点
                /*IF sales_cstmr_base_cd != null*/
                    AND hidden_item.sales_cstmr_customer_branch_cd = /*sales_cstmr_base_cd*/'' 
                /*END*/
                /*IF sales_cstmr_base_cd == null && sales_cstmr_base_name != null*/
                    AND ssfa_varchar_normalze(hidden_item.sales_cstmr_base_name) LIKE '%' /*$sql_concat*/|| ssfa_varchar_normalze(/*sales_cstmr_base_name*/'') /*$sql_concat*/|| '%' 
                /*END*/
                -- 得意先部署(内部)
                /*IF sales_cstmr_dept_internal_comp_cd != null*/
                    AND hidden_item.sales_cstmr_comp_cd_internal = /*sales_cstmr_dept_internal_comp_cd*/'' 
                /*END*/
                /*IF sales_cstmr_dept_internal_dept_set_cd != null*/
                    AND hidden_item.sales_cstmr_dept_set_cd_internal = /*sales_cstmr_dept_internal_dept_set_cd*/'' 
                /*END*/
                /*IF sales_cstmr_dept_internal_cd != null*/
                    AND hidden_item.sales_cstmr_dept_cd_internal = /*sales_cstmr_dept_internal_cd*/'' 
                /*END*/
                /*IF sales_cstmr_dept_internal_cd == null && sales_cstmr_dept_internal_name != null*/
                    AND hidden_item.sales_cstmr_dept_internal_name LIKE '%' /*$sql_concat*/|| /*sales_cstmr_dept_internal_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                -- 得意先部署(通常)
                /*IF sales_cstmr_dept_normal_name != null*/
                    AND hidden_item.sales_cstmr_dept_name_normal LIKE '%' /*$sql_concat*/|| /*sales_cstmr_dept_normal_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                -- 得意先担当者(内部)
                /*IF sales_cstmr_person_internal_cd != null*/
                    AND hidden_item.sales_cstmr_person_internal_cd = /*sales_cstmr_person_internal_cd*/'' 
                /*END*/
                /*IF sales_cstmr_person_internal_cd == null && sales_cstmr_person_internal_name != null*/
                    AND hidden_item.sales_cstmr_person_internal_name LIKE '%' /*$sql_concat*/|| /*sales_cstmr_person_internal_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                -- 得意先担当者(通常)
                /*IF sales_cstmr_person_normal_sys_person_id != null*/
                    AND hidden_item.sales_cstmr_person_normal_sys_person_id = /*sales_cstmr_person_normal_sys_person_id*/'' 
                /*END*/
                /*IF sales_cstmr_person_normal_sys_person_id == null && sales_cstmr_person_normal_name != null*/
                    AND hidden_item.sales_cstmr_person_normal_name LIKE '%' /*$sql_concat*/|| /*sales_cstmr_person_normal_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                    -- ターゲット顧客
                -- 得意先
                /*IF target_cstmr_corp_cd != null*/
                    AND hidden_item.target_cstmr_customer_cd = /*target_cstmr_corp_cd*/'' 
                /*END*/
                /*IF target_cstmr_corp_cd == null && target_cstmr_corp_name != null*/
                    AND hidden_item.target_cstmr_corp_name LIKE '%' /*$sql_concat*/|| /*target_cstmr_corp_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                -- 得意先拠点
                /*IF target_cstmr_base_cd != null*/
                    AND hidden_item.target_cstmr_customer_branch_cd = /*target_cstmr_base_cd*/'' 
                /*END*/
                /*IF target_cstmr_base_cd == null && target_cstmr_base_name != null*/
                    AND hidden_item.target_cstmr_base_name LIKE '%' /*$sql_concat*/|| /*target_cstmr_base_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                -- 得意先部署(内部)
                /*IF target_cstmr_dept_internal_comp_cd != null*/
                    AND hidden_item.target_cstmr_comp_cd_internal = /*target_cstmr_dept_internal_comp_cd*/'' 
                /*END*/
                /*IF target_cstmr_dept_internal_dept_set_cd != null*/
                    AND hidden_item.target_cstmr_dept_set_cd_internal = /*target_cstmr_dept_internal_dept_set_cd*/'' 
                /*END*/
                /*IF target_cstmr_dept_internal_cd != null*/
                    AND hidden_item.target_cstmr_dept_cd_internal = /*target_cstmr_dept_internal_cd*/'' 
                /*END*/
                /*IF target_cstmr_dept_internal_cd == null && target_cstmr_dept_internal_name != null*/
                    AND hidden_item.target_cstmr_dept_internal_name LIKE '%' /*$sql_concat*/|| /*target_cstmr_dept_internal_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                -- 得意先部署(通常)
                /*IF target_cstmr_dept_normal_name != null*/
                    AND hidden_item.target_cstmr_dept_name_normal LIKE '%' /*$sql_concat*/|| /*target_cstmr_dept_normal_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                -- 得意先担当者(内部)
                /*IF target_cstmr_person_internal_cd != null*/
                    AND hidden_item.target_cstmr_person_internal_cd = /*target_cstmr_person_internal_cd*/'' 
                /*END*/
                /*IF target_cstmr_person_internal_cd == null && target_cstmr_person_internal_name != null*/
                    AND hidden_item.target_cstmr_person_internal_name LIKE '%' /*$sql_concat*/|| /*target_cstmr_person_internal_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                -- 得意先担当者(通常)
                /*IF target_cstmr_person_normal_sys_person_id != null*/
                    AND hidden_item.target_cstmr_person_normal_sys_person_id = /*target_cstmr_person_normal_sys_person_id*/'' 
                /*END*/
                /*IF target_cstmr_person_normal_sys_person_id == null && target_cstmr_person_normal_name != null*/
                    AND hidden_item.target_cstmr_person_normal_name LIKE '%' /*$sql_concat*/|| /*target_cstmr_person_normal_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                    -- フラグ
                /*IF important_flag != null*/
                    AND rtme.important_flag = /*important_flag*/'' 
                /*END*/
                /*IF construction_flag != null*/
                    AND rtmed.construction_flag = /*construction_flag*/'' 
                /*END*/
                /*IF hidden_flag != null*/
                    AND stm.hidden_flag = /*hidden_flag*/'' 
                /*END*/
                /*IF internal_biz_flag != null*/
                    AND rtme.internal_biz_flag = /*internal_biz_flag*/'' 
                /*END*/
                /*IF focus_flag != null*/
                    AND rtmed.focus_flag = /*focus_flag*/'' 
                /*END*/
                /*IF provisional_status != null*/
                    AND rtmed.provisional_status_flag = /*provisional_status*/'' 
                /*END*/
                    -- NK区分
                /*IF nk_type != null*/
                    AND rtme.nk_type_cd IN /*nk_type*/('') 
                /*END*/
                    -- 受注予定日
                /*IF receive_plan_date_from != null*/
                    AND rtmed.receive_plan_year_month_date >= /*receive_plan_date_from*/'2018/10/17' 
                /*END*/
                /*IF receive_plan_date_to != null*/
                    AND rtmed.receive_plan_year_month_date <= /*receive_plan_date_to*/'2018/10/17' 
                /*END*/
                    -- 売上予定日
                /*IF sales_plan_date_from != null*/
                    AND rtmed.sales_plan_year_month_date >= /*sales_plan_date_from*/'2018/10/17' 
                /*END*/
                /*IF sales_plan_date_to != null*/
                    AND rtmed.sales_plan_year_month_date <= /*sales_plan_date_to*/'2018/10/17' 
                /*END*/
                    -- 案件番号
                /*IF matter_no != null*/
                    AND stm.matter_no = /*matter_no*/'' 
                /*END*/
                    -- 案件名
                /*IF matter_name != null*/
                    AND hidden_item.matter_name LIKE '%' /*$sql_concat*/|| /*matter_name*/'' /*$sql_concat*/|| '%' 
                /*END*/
                    -- 案件内容
                /*IF description != null*/
                    AND stm.description LIKE '%' /*$sql_concat*/|| /*description*/'' /*$sql_concat*/|| '%' 
                /*END*/
                    -- 詳細番号
                /*IF matter_dtl_no != null*/
                    AND rtmed.matter_dtl_no = /*matter_dtl_no*/'' 
                /*END*/
                    -- 詳細件名
                /*IF matter_dtl_name != null*/
                    AND rtmed.matter_dtl_name = /*matter_dtl_name*/''
                /*END*/
                    -- 受注予定金額
                /*IF sprice != null*/
                    AND rtmei.sprice >= /*sprice*/'' 
                /*END*/
                    -- 案件状態1
                /*IF matter_status1_cd != null*/
                    AND rtmed.matter_status1_cd IN /*matter_status1_cd*/('') 
                /*END*/
                    -- 案件状態2
                /*IF matter_status2_cd != null*/
                    AND rtmed.matter_status2_cd IN /*matter_status2_cd*/('') 
                /*END*/
                /*IF im_owner_user_cd != null || im_owner_user_name != null*/
                    -- 案件担当者(自社担当者)
                    AND EXISTS ( 
                        SELECT
                            1 
                        FROM
                            ssfa_t_matter_user stmu 
                            INNER JOIN imm_user imu 
                                ON imu.user_cd = stmu.im_owner_user_cd 
                                AND imu.locale_id = /*locale_id*/'ja' 
                                AND imu.start_date <= /*target_date*/'2018/10/17' 
                                AND imu.end_date > /*target_date*/'2018/10/17' 
                        WHERE
                            stmu.matter_id = stm.matter_id 
                            AND stmu.delete_flag = '0' 
                            AND stmu.application_id = /*application_id*/'ssfa' 
                        /*IF im_owner_user_cd != null*/
                            AND stmu.im_owner_user_cd = /*im_owner_user_cd*/'' 
                        /*END*/
                        /*IF im_owner_user_cd == null && im_owner_user_name != null*/
                            AND imu.user_name LIKE '%' /*$sql_concat*/|| /*im_owner_user_name*/'' /*$sql_concat*/|| '%' 
                        /*END*/
                    ) 
                /*END*/
                /*IF create_user_code != null || create_user_name != null*/
                    -- 作成者
                    AND EXISTS ( 
                        SELECT
                            1 
                        FROM
                            imm_user imu 
                        WHERE
                            imu.user_cd = stm.create_user_cd
                            AND imu.start_date <= /*target_date*/'2019/01/01' 
                            AND imu.end_date > /*target_date*/'2019/01/01' 
                            AND imu.locale_id = /*locale_id*/'ja' 
                        /*IF create_user_code != null */
                            AND imu.user_cd = /*create_user_code*/'' 
                        /*END*/
                        /*IF create_user_name == null && create_user_name != null*/
                            AND imu.user_name LIKE '%' /*$sql_concat*/|| /*create_user_name*/'' /*$sql_concat*/|| '%' 
                        /*END*/
                    ) 
                /*END*/
                /*IF sys_person_id != null*/
                    -- 案件関係者
                    AND EXISTS ( 
                        SELECT
                            1 
                        FROM
                            ssfa_t_matter_cstmr_user stmcu 
                        WHERE
                            stmcu.matter_id = stm.matter_id 
                            AND stmcu.delete_flag = '0' 
                            AND stmcu.application_id = /*application_id*/'ssfa' 
                            AND stmcu.sys_person_id = /*sys_person_id*/''
                    ) 
                /*END*/
                /*IF construction_no != null || estimate_no != null*/
                    AND EXISTS ( 
                        SELECT
                            1 
                        FROM
                            rsfa_t_estimate rte -- 見積
                        WHERE
                            rte.matter_id = stm.matter_id 
                            AND rte.application_id = /*application_id*/'ssfa' 
                            AND rte.delete_flag = '0' 
                        /*IF owner_comp_cd != null*/
                            AND rte.im_owner_comp_cd = /*owner_comp_cd*/'' 
                        /*END*/
                        /*IF owner_dept_set_cd != null*/
                            AND rte.im_owner_dept_set_cd = /*owner_dept_set_cd*/'' 
                        /*END*/
                        /*IF owner_dept_cds != null*/
                            AND rte.im_owner_dept_cd IN /*owner_dept_cds*/('') 
                        /*END*/
                        /*IF owner_dept_cds == null && owner_dept_code != null*/
                            AND rte.im_owner_dept_cd = /*owner_dept_code*/ 
                        /*END*/
                        /*IF construction_no != null*/
                            AND rte.construction_no = /*construction_no*/'' 
                        /*END*/
                        /*IF estimate_no != null*/
                            AND rte.estimate_no = /*estimate_no*/'' 
                        /*END*/
                    ) 
                /*END*/
                /*IF campaign_name != null || imfr_campaign_id != null*/
                    AND EXISTS ( 
                        -- キャンペーン
                        SELECT
                            1 
                        FROM
                            rsfa_t_matter_ex_campaign rtmec -- 案件拡張キャンペーン
                            INNER JOIN rsfa_t_imfr_campaign_cmn rticc 
                                ON rtmec.imfr_campaign_id = rticc.imfr_campaign_id 
                        WHERE
                            rtmec.matter_id = stm.matter_id 
                            AND rtmec.matter_dtl_id = rtmed.matter_dtl_id 
                            AND rtmec.imfr_campaign_id = rticc.imfr_campaign_id 
                            AND rtmec.application_id = /*application_id*/'ssfa' 
                            AND rtmec.delete_flag = '0' 
                            AND rticc.application_id = /*application_id*/'ssfa' 
                            AND rticc.delete_flag = '0' 
                        /*IF campaign_name != null*/
                            AND rticc.campaign_name LIKE '%' /*$sql_concat*/|| /*campaign_name*/'' /*$sql_concat*/|| '%' 
                        /*END*/
                        /*IF imfr_campaign_id != null*/
                            AND rticc.imfr_campaign_id = /*imfr_campaign_id*/'' 
                        /*END*/
                    ) 
                /*END*/
/*IF im_main_owner_user_group_code != null || im_main_owner_user_group_name != null*/
            AND EXISTS ( 
                -- 主担当者グループ
                -- 主担当者グループタイプが「プライベートグループ」またはNULLの時
                /*IF im_main_owner_user_group_type_private != null || im_main_owner_user_group_type == null*/
                SELECT
                    1 
                FROM
                    imm_private_grp iprg 
                    INNER JOIN imm_private_grp_ath iprga 
                        ON iprg.private_group_cd = iprga.private_group_cd 
                        AND iprg.user_cd = iprga.owner_cd 
                WHERE
                    ( 
                        iprga.user_cd = rtme.im_main_owner_user_cd 
                        OR iprga.owner_cd = rtme.im_main_owner_user_cd
                    ) 
                    AND iprg.user_cd = /*login_user_cd*/'' 
                    AND iprg.private_group_cd = iprga.private_group_cd 
                    AND iprg.user_cd = iprga.owner_cd
                    /*IF im_main_owner_user_group_code != null*/
                    AND iprg.private_group_cd = /*im_main_owner_user_group_code*/'' 
                    /*END*/
                    /*IF im_main_owner_user_group_name != null*/
                    AND (iprg.private_group_name LIKE '%' /*$sql_concat*/|| /*im_main_owner_user_group_name*/'' /*$sql_concat*/|| '%' 
                    OR iprg.private_group_search_name LIKE '%' /*$sql_concat*/|| /*im_main_owner_user_group_name*/'' /*$sql_concat*/|| '%')
                    /*END*/
                /*END*/
                    -- 主担当者グループタイプがNULLの時
                /*IF im_main_owner_user_group_type == null*/
                    UNION ALL 
                /*END*/
                    -- 主担当者グループタイプが「パブリックグループ」またはNULLの時
                /*IF im_main_owner_user_group_type_public != null || im_main_owner_user_group_type == null*/
                    SELECT
                    1 
                FROM
                    imm_public_grp ipug 
                    INNER JOIN imm_public_grp_ath ipuga 
                        ON ipuga.public_group_set_cd = ipug.public_group_set_cd 
                        AND ipuga.public_group_cd = ipug.public_group_cd 
                        AND ipuga.start_date <= /*target_date*/'2019/01/01'
                        AND ipuga.end_date > /*target_date*/'2019/01/01'                
                    INNER JOIN imm_public_grp_inc_ath ipugia 
                        ON ipugia.public_group_set_cd = ipuga.public_group_set_cd 
                        AND ipugia.public_group_cd = ipuga.public_group_cd 
                        AND ipugia.start_date <= /*target_date*/'2019/01/01'
                        AND ipugia.end_date > /*target_date*/'2019/01/01' 
                WHERE
                    ipuga.user_cd = rtme.im_main_owner_user_cd 
                    AND ipug.start_date <= /*target_date*/'2019/01/01'
                    AND ipug.end_date > /*target_date*/'2019/01/01'                
                    AND ipug.locale_id = /*locale_id*/'ja'  
                    AND ipugia.public_group_set_cd = ipuga.public_group_set_cd 
                    AND ipugia.public_group_cd = ipuga.public_group_cd 
                    AND ipuga.public_group_set_cd = ipug.public_group_set_cd 
                    AND ipuga.public_group_cd = ipug.public_group_cd 
                    /*IF im_main_owner_user_public_group_set_cd != null*/
                    AND ipug.public_group_set_cd = /*im_main_owner_user_public_group_set_cd*/'' 
                    /*END*/
                    /*IF im_main_owner_user_group_name != null*/
                    AND (ipug.public_group_name LIKE '%' /*$sql_concat*/|| /*im_main_owner_user_group_name*/'' /*$sql_concat*/|| '%' 
                    OR ipug.public_group_short_name LIKE '%' /*$sql_concat*/|| /*im_main_owner_user_group_name*/'' /*$sql_concat*/|| '%' 
                    OR ipug.public_group_search_name LIKE '%' /*$sql_concat*/|| /*im_main_owner_user_group_name*/'' /*$sql_concat*/|| '%')
                    /*END*/
                /*END*/
            )
        /*END*/


                /*IF create_user_group_code != null || create_user_group_name != null*/ 
                AND EXISTS ( 
                        -- 作成者グループ
                        -- 作成者グループタイプが「プライベートグループ」またはNULLの時
                        /*IF create_user_group_type_private != null || create_user_group_type == null */
                        SELECT
                            1 
                        FROM
                            imm_private_grp iprg 
                            INNER JOIN imm_private_grp_ath iprga 
                                ON iprg.private_group_cd = iprga.private_group_cd 
                                AND iprg.user_cd = iprga.owner_cd 
                            INNER JOIN ssfa_t_matter_user stmu1 
                                ON iprga.user_cd = stmu1.create_user_cd 
                                OR iprga.owner_cd = stmu1.create_user_cd 
                        WHERE
                                iprga.user_cd = stmu1.create_user_cd 
                                OR iprga.owner_cd = stmu1.create_user_cd
                            AND iprg.user_cd = /*login_user_cd*/'' --
                            AND iprg.private_group_cd = iprga.private_group_cd 
                            AND iprg.user_cd = iprga.owner_cd 
                            /*IF create_user_group_code != null*/
                            AND iprg.private_group_cd = /*create_user_group_code*/'' 
                            /*END*/
                            /*IF create_user_group_name != null*/
                            AND 
                                iprg.private_group_name LIKE '%' /*$sql_concat*/|| /*create_user_group_name*/'' /*$sql_concat*/|| '%'
                                OR iprg.private_group_search_name LIKE '%' /*$sql_concat*/|| /*create_user_group_name*/'' /*$sql_concat*/|| '%'
                            /*END*/
                        /*END*/
                            -- 作成者グループタイプがNULLの時
                        /*IF create_user_group_type == null*/
                            UNION ALL 
                        /*END*/
                            -- 作成者グループタイプが「パブリックグループ」またはNULLの時、
                        /*IF create_user_group_type_public != null || create_user_group_type == null  */
                            SELECT
                            1 
                        FROM
                            imm_public_grp ipug 
                            INNER JOIN imm_public_grp_ath ipuga 
                                ON ipuga.public_group_set_cd = ipug.public_group_set_cd 
                                AND ipuga.public_group_cd = ipug.public_group_cd 
                                AND ipuga.start_date <= /*target_date*/'2019/01/01'
                                AND ipuga.end_date > /*target_date*/'2019/01/01'                
                            INNER JOIN imm_public_grp_inc_ath ipugia 
                                ON ipugia.public_group_set_cd = ipuga.public_group_set_cd 
                                AND ipugia.public_group_cd = ipuga.public_group_cd
                                AND ipugia.start_date <= /*target_date*/'2019/01/01'
                                AND ipugia.end_date > /*target_date*/'2019/01/01' 
                            INNER JOIN ssfa_t_matter_user stmu2 
                                ON ipuga.user_cd = stmu2.create_user_cd 
                        WHERE
                            ipuga.user_cd = stmu2.create_user_cd 
                            AND ipug.start_date <= /*target_date*/'2019/01/01'
                            AND ipug.end_date > /*target_date*/'2019/01/01'                
                            AND ipug.locale_id = /*locale_id*/'ja'  
                            AND ipugia.public_group_set_cd = ipuga.public_group_set_cd 
                            AND ipugia.public_group_cd = ipuga.public_group_cd 
                            AND ipuga.public_group_set_cd = ipug.public_group_set_cd 
                            AND ipuga.public_group_cd = ipug.public_group_cd 
                            /*IF create_user_public_group_set_cd != null*/
                            AND ipug.public_group_set_cd = /*create_user_public_group_set_cd*/'' 
                            /*END*/
                            /*IF create_user_group_code != null*/
                            AND ipug.public_group_cd = /*create_user_group_code*/'' 
                            /*END*/
                            /*IF create_user_group_name != null*/
                            AND
                                ipug.public_group_name LIKE '%' /*$sql_concat*/|| /*create_user_group_name*/'' /*$sql_concat*/|| '%'
                                OR ipug.public_group_short_name LIKE '%' /*$sql_concat*/|| /*create_user_group_name*/'' /*$sql_concat*/|| '%' 
                                OR ipug.public_group_search_name LIKE '%' /*$sql_concat*/|| /*create_user_group_name*/'' /*$sql_concat*/|| '%'
                            /*END*/
                        /*END*/
                    )
                /*END*/
    )T
