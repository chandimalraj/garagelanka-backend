function generateHTML(id, bill, itemsList, customer) {
    return(
        `
        <!DOCTYPE html>
        <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <title>Invoice</title>
          
              <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> 
          
              <style>
                  html{
                      width: 210mm;
                      min-height: 317mm;
                  }
                  #footer {
                      position: relative;
                      bottom: 0;
                      margin-bottom: 0;
                  }
                  .in-body {
                      height: 860px
                  }
                  @page {
                    size: A4;
                    margin: 0;
                  }
                  @media print {
                      html, body {
                          width: 210mm;
                          height: 297mm;
                      }
                  }        
              </style>        
          </head>
          <body>
              <div class="border border-dark" id="content-size">
                  <img src="https://i.ibb.co/BGT2D7r/Header.png" width="100%" height="auto" alt="Header">               
                  
                  <div class="container" id="client">
                      <div class="row">
                          <div class="col-9 ml-5">
                              <h2 class="mt-3 font-weight-bold" style="color:#000080">Invoice</h2>
                              <p class="font-weight-bold">Invoice # ${id} , ${new Date(bill.billing_date).toLocaleDateString()} - ${new Date(bill.billing_date).toLocaleTimeString()} </p>
                          </div>
                          <div class="col-1 mt-5">
                          </div>
                      </div>            
                  </div>
                  
                  <div class="in-body mr-5 ml-5">
                      <table class="table mt-3">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Descripton</th>
                              <th scope="col" class="text-center">Qty</th>
                              <th scope="col" class="text-center">Price (Rs.)</th>
                              <th scope="col" class="text-center">Discount (Rs.)</th>
                              <th scope="col" class="text-center">Total (Rs.)</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${itemsList.map((i, index) => {
                              return(`
                                <tr>
                                  <th scope="row">${index + 1}</th>
                                  <td>${i.itemName}</td>
                                  <td class="text-center">${i.qnt}</td>
                                  <td class="text-right">${i.unit_price.toFixed(2)}</td>
                                  <td class="text-right">${i.unit_discount ? i.unit_discount.toFixed(2) : "-"}</td>
                                  <td class="text-right">${i.total.toFixed(2)}</td>
                                </tr>  
                              `)
                            })}                                                              
                          </tbody>
                        </table>
                        <hr> 
                        <div class="row mt-5">
                          <div class="col-6  ml-5">
                            <h5 class="mt-3 mb-5 font-weight-bold">Invoice To</h5>
                              <h6 class="mb-4 font-weight-bold">${customer.name ? customer.name : ""}</h6>
                              <div class="row">
                                <div class="col-4 ">
                                  <p>Mobile   </p>
                                  <p>Email   </p>
                                  <p>Vehicle   </p>
                                  <p>Mileage </p>
                                </div>
                                <div class="col-8 font-weight-bold">
                                  <p>${customer.mobile ? customer.mobile : ""}</p>
                                  <p>${customer.email ? customer.email : ""}</p>
                                  <p>${customer.vehicle ? customer.vehicle : ""}</p>
                                  <p>${customer.mileage ? customer.mileage + " KM" : ""}</p>
                                </div>
                              </div>                            
                          </div>
                          <div class="col-3 text-center ">
                            <p>Subtotal    </p>
                            <p>Discount  </p>
                            <h5 class="font-weight-bold">Grand Total  </h5>
                          </div>
                          <div class="col-2 text-right font-weight-bold">
                            <p> Rs. ${bill.total_amount.toFixed(2)}</p>
                            <p> Rs. ${bill.discount ? bill.discount.toFixed(2) : 0.00}</p>
                            <h5 class="font-weight-bold"> Rs. ${bill.grand_total.toFixed(2)}</h5>
                          </div>
                        </div>
                  </div>
                  <div id="footer">
                    <img src="https://i.ibb.co/W6dtR6s/Footer.png" width="100%" height="auto" alt="Footer">
                  </div>                
              </div>            
          </body>
        </html>
    `)
}



module.exports = generateHTML