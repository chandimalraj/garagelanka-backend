const config = require("config");
var ObjectId = require("mongodb").ObjectID;
var HashMap = require("hashmap");
const { validationResult } = require("express-validator");

const District = require("../../models/District");
const instantBillModel = require("../../models/BillingItem");
const serviceBillModel = require("../../models/ServiceBillingItem");
const itemExpencesModel = require("../../models/ItemsExpense");
const serviceExpencesModel = require("../../models/ServiceExpense");

exports.getSalesRecordsBysc_id = async (req, res) => {
  try {
    const { service_center_id, district_id, start_date, end_date } = req.body;

    if (service_center_id != req.user.serviceCenter._id) {
      console.log(
        " Cannot allow to get information. user requested information of different service center : " +
          req.user.serviceCenterID
      );
      return res.status(400).json({
        msg: "Cannot allow to get information. user requested information of different service center",
      });
    } else {
      const district = await District.findById({
        _id: ObjectId(district_id),
      });

      const district_name = district.name_en;
      const collection_name = `${district_name}__service_bill`;
      const collection_name_lower = collection_name.toLowerCase();
      const collection_name_inst = `${district_name}__instant_bill`;
      const collection_name_lower_inst = collection_name_inst.toLowerCase();
      const col_name_item_expenses = `${district_name}__items_expense`;
      const col_name_lower_items_expense = col_name_item_expenses.toLowerCase();
      const col_name_service_expenses = `${district_name}__service_expense`;
      const col_name_lower_service_expenses =
        col_name_service_expenses.toLowerCase();

      console.log("collection_name :", collection_name_lower);

      const ServiceBill = serviceBillModel(collection_name_lower); //create collection
      const instantBill = instantBillModel(collection_name_lower_inst);
      const itemExpences = itemExpencesModel(col_name_lower_items_expense);
      const serviceExpences = serviceExpencesModel(
        col_name_lower_service_expenses
      );

      console.log("service bill model ", ServiceBill);

      /*
       Get Service Bill Info
      */
      let grossServiceIncomePipeline = [
        {
          $match: {
            serviceCenterId: ObjectId(service_center_id),
            billingDate: {
              $gte: new Date(start_date), //new Date(start_date),
              $lte: new Date(end_date), //new Date(end_date),
            },
          },
        },
        {
          $group: {
            _id: "$category", //SERVICE_BILL,ACCIDENT_REPAIR
            total: { $sum: "$finalAmount" },

            averagePrice: { $avg: "$finalAmount" },
          },
        },
      ];

      const serviceGrossIncome = await ServiceBill.aggregate(
        grossServiceIncomePipeline
      );

      console.log("Service gross income", serviceGrossIncome);

      //get total earnings through garage lanka
      let totalEarningsViaGLPipeLine = [
        {
          $match: {
            serviceCenterId: ObjectId(service_center_id),
            billingDate: {
              $gte: new Date(start_date), //new Date(start_date),
              $lte: new Date(end_date), //new Date(end_date),
            },
            billingType: "GL",
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$finalAmount" },
            count: { $sum: 1 },
          },
        },
      ];

      const totalEarningsViaGL = await ServiceBill.aggregate(
        totalEarningsViaGLPipeLine
      );

      var thisMonthGLVisitors = totalEarningsViaGL[0].count;

      console.log("total earnings via garagelanka", totalEarningsViaGL);

      //---lastMonthGL visitors

      //get total earnings through garage lanka
      let totalEarningsViaGLPreviousMonthPipeLine = [
        {
          $match: {
            serviceCenterId: ObjectId(service_center_id),
            billingDate: {
              $gte: new Date(start_date - 30), //new Date(start_date),
              $lte: new Date(start_date), //new Date(end_date),
            },
            billingType: "GL",
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$finalAmount" },
            count: { $sum: 1 },
          },
        },
      ];

      const totalLastMonthEarningsViaGL = await ServiceBill.aggregate(
        totalEarningsViaGLPreviousMonthPipeLine
      );

      totalLastMonthEarningsViaGLCount = totalLastMonthEarningsViaGL[0].count;

      console.log(
        "total last month earnings via garagelanka",
        totalLastMonthEarningsViaGL
      );

      //----Get most recent Service Ernings-----

      const serviceBillsList = await ServiceBill.find({
        billingDate: {
          $gte: new Date(start_date),
          $lte: new Date(end_date),
        },
      });
      console.log("Recent service earninigs", serviceBillsList);

      //--------------------------------

      /*
       Instant Bill
      */
      let grossInstanceIncomePipeline = [
        {
          $match: {
            service_center_id: ObjectId(service_center_id),
            billing_date: {
              $gte: new Date(start_date),
              $lte: new Date(end_date),
            },
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$total_amount" },
            // number_of_instance_sales: { $count: "INST" },
            averagePrice: { $avg: "$total_amount" },
          },
        },
      ];

      const instantGrossIncome = await instantBill.aggregate(
        grossInstanceIncomePipeline
      );

      console.log("Instace bill aggrigate", instantGrossIncome);

      //----Get most recent Instant  Ernings-----

      const instantBillList = await instantBill.find({
        billingDate: {
          $gte: new Date(start_date),
          $lte: new Date(end_date),
        },
      });
      console.log("Recent instant earninigs", instantBillList);

      //--------------------------------

      /*
       Item Expenses
      */
      let itemExpensesPipeline = [
        {
          $match: {
            service_center_id: ObjectId(service_center_id),
            billing_date: {
              $gte: new Date(start_date),
              $lte: new Date(end_date),
            },
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$total_amount" },
            // number_of_instance_sales: { $count: "INST" },
            averagePrice: { $avg: "$total_amount" },
          },
        },
      ];

      const itemsExpenses = await itemExpences.aggregate(itemExpensesPipeline);

      console.log("Item Expenses", itemsExpenses);

      //----Get most recent Item Expenses -----

      const itemExpensesList = await itemExpences.find({
        billingDate: {
          $gte: new Date(start_date),
          $lte: new Date(end_date),
        },
      });
      console.log("Recent item Expenses", itemExpensesList);

      //--------------------------------

      /*
       Service Expenses
      */
      let serviceExpensesPipeline = [
        {
          $match: {
            service_center_id: ObjectId(service_center_id),
            billing_date: {
              $gte: new Date(start_date),
              $lte: new Date(end_date),
            },
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$total_amount" },
            // number_of_instance_sales: { $count: "INST" },
            averagePrice: { $avg: "$total_amount" },
          },
        },
      ];

      const servicesExpenses = await serviceExpences.aggregate(
        serviceExpensesPipeline
      );

      console.log("Service Expenses", servicesExpenses);

      //----Get most recent Service Expenses -----

      const serviceExpensesList = await serviceExpences.find({
        billingDate: {
          $gte: new Date(start_date),
          $lte: new Date(end_date),
        },
      });
      console.log("Recent service Expenses", serviceExpensesList);

      //--------------------------------

      //Calculate totla Income for graph
      /*
      Get Service Bill Info
     */
      let incomeRangePipeline = [
        {
          $match: {
            serviceCenterId: ObjectId(service_center_id),
            billingDate: {
              $gte: new Date(start_date), //new Date(start_date),
              $lte: new Date(end_date), //new Date(end_date),
            },
          },
        },
        {
          $group: {
            _id: "$billingDate", //SERVICE_BILL,ACCIDENT_REPAIR
            total: { $sum: "$finalAmount" },
          },
        },
      ];

      //get total income according to billing dates
      const grossServiceIncomes = await ServiceBill.aggregate(
        incomeRangePipeline
      );

      console.log(
        "total income according to billing dates",
        grossServiceIncomes.length
      );

      var totalIncomeMap = new HashMap();

      grossServiceIncomes.forEach((element) => {
        var billingDate = element._id;
        var serviceIncomeTot = element.total;
        totalIncomeMap.set(billingDate, serviceIncomeTot);
      });

      console.log("totalIncomeMap Size", totalIncomeMap.size);

      //get instant bills

      const grossInstanceIncomes = await instantBill.aggregate(
        incomeRangePipeline
      );

      //add  instant bill amount to calculate totla for each day
      grossInstanceIncomes.forEach((instantBillAmount) => {
        totalIncomeMap.get(instantBillAmount.billing_date) + instantBillAmount;
      });

      //-----------------------------------------------------
      //Calculate totla Expenses for graph
      /*
      Get Service Expenses Info
     */
      let expensesRangePipeline = [
        {
          $match: {
            service_center_id: ObjectId(service_center_id),
            billing_date: {
              $gte: new Date(start_date), //new Date(start_date),
              $lte: new Date(end_date), //new Date(end_date),
            },
          },
        },
        {
          $group: {
            _id: "$billingDate", //SERVICE_BILL,ACCIDENT_REPAIR
            total: { $sum: "$totalAmount" },
          },
        },
      ];

      //get totla income according to billing dates
      const grossServiceExpenses = await serviceExpences.aggregate(
        expensesRangePipeline
      );

      console.log("ServiceExpenses", grossServiceExpenses.length);

      var totalExpensesMap = new HashMap();

      grossServiceExpenses.forEach((element) => {
        var billingDate = element._id;
        var serviceExpensesTot = element.total;
        totalExpensesMap.set(billingDate, serviceExpensesTot);
      });

      console.log("totalExpensesMap Size", totalExpensesMap.size);

      //get instant bills

      const grossItemExpenses = await itemExpences.aggregate(
        expensesRangePipeline
      );

      grossItemExpenses.forEach((itemExpense) => {
        totalExpensesMap.get(itemExpense.billing_date) + itemExpense;
      });

      //--Get service count for each day for bar chart ----

      let serviceCountPipeline = [
        {
          $match: {
            serviceCenterId: ObjectId(service_center_id),
            billingDate: {
              $gte: new Date(start_date), //new Date(start_date),
              $lte: new Date(end_date), //new Date(end_date),
            },
          },
        },
        {
          $group: {
            _id: "$billingDate", //SERVICE_BILL,ACCIDENT_REPAIR
            count: { $sum: 1 },
          },
        },
      ];

      const serviceCountDaily = await ServiceBill.aggregate(
        serviceCountPipeline
      );

      console.log("service count each day", serviceCountDaily);

      //end ------

      /*
       Calculations
      */
      var totlaGrossIncome = 0;
      var totalNetIncome = 0;
      var totalSGI;
      var totlaIGI;
      var totlaIE;
      var totalSE;

      if ((serviceGrossIncome.length > 0) & (instantGrossIncome.length > 0)) {
        totlaGrossIncome =
          serviceGrossIncome[0].total + instantGrossIncome[0].total;
      }
      if ((itemsExpenses.length > 0) & (servicesExpenses.length > 0)) {
        totalNetIncome =
          totlaGrossIncome - itemsExpenses[0].total - servicesExpenses[0].total;
      }

      totalSGI =
        serviceGrossIncome.length > 0
          ? serviceGrossIncome[0].total.toString()
          : 0;
      totlaIGI =
        instantGrossIncome.length > 0
          ? instantGrossIncome[0].total.toString()
          : 0;
      totlaIE =
        itemsExpenses.length > 0 ? itemsExpenses[0].total.toString() : 0;
      totalSE =
        servicesExpenses.length > 0 ? servicesExpenses[0].total.toString() : 0;
      totlaEarningsViaGL =
        totalEarningsViaGL.length > 0
          ? totalEarningsViaGL[0].total.toString()
          : 0;
      var GLVisitersPercentage =
        ((totalLastMonthEarningsViaGLCount - thisMonthGLVisitors) /
          totalLastMonthEarningsViaGLCount) *
        100;
      profitEarnViaGLComparedToLastMonth =
        ((totalLastMonthEarningsViaGL[0].total - totalEarningsViaGL[0].total) /
          totalLastMonthEarningsViaGL[0].total) *
        100;

      return res.status(200).json({
        date_range: start_date + "-" + end_date,
        totlaServiceGrossIncome: totalSGI,
        totlaInstantGrossIncome: totlaIGI,
        totlaGrossIncome: totlaGrossIncome,
        recentServiceEarningsList: serviceBillsList,
        recentInstantEarningsList: instantBillList,
        recentItemExpensesList: itemExpensesList,
        recentServiceExpensesList: serviceExpensesList,
        serviceCountDaily: serviceCountDaily,
        totalItemsExpenses: totlaIE,
        totalServiceExpenses: totalSE,
        totalNetIncome: totalNetIncome,
        totalIncomeMap: totalIncomeMap,
        totalExpensesMap: totalExpensesMap,
        totalErningsThroughGL: totlaEarningsViaGL,
        totlaDirectEarnings: totalSGI - totlaEarningsViaGL + totlaIGI,
        thisMonthGLVisitors: thisMonthGLVisitors,
        totalLastMonthEarningsViaGL: totalLastMonthEarningsViaGL,
        GLVisitersPercentage: GLVisitersPercentage,
        profitEarnViaGLComparedToLastMonthPercentage:
          profitEarnViaGLComparedToLastMonth,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};
