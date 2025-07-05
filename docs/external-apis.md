# External APIs – Ứng dụng Chăm Sóc Sức Khỏe & Thể Hình (UTH)

## 1. Nutrition API – Phân tích thành phần món ăn

- **Tên dịch vụ:** [Nutritionix API](https://www.nutritionix.com/business/api)
- **Endpoint:** `https://trackapi.nutritionix.com/v2/natural/nutrients`
- **Method:** `POST`
- **Ghi chú:** API chỉ hỗ trợ tiếng anh
- **Headers:**
```http
x-app-id: <APP_ID>         # VD: 7169[xxxx]
x-app-key: <APP_KEY>       # VD: 5d41925bebb6b5309b1b61e82817[xxxx]
Content-Type: application/json
```
- **Body (raw → JSON):** 
```json
{
  "query": "2 pork banh mi, 1 glass of milk"
}
```
## 2. Translate API – Google Apps Script
- **Tên dịch vụ:** [Google Apps Script](https://script.google.com/home/start), [Script dịch văn bản](https://script.google.com/d/1EBmAfaLUxMYR6z0_EbQPCMR8hYdEGRdQHKojmzB5_aiPe6OGtALlYvKB/edit?usp=sharing)
- **Endpoint:** `https://script.google.com/macros/s/AKfycbzaDdjozCE4Y17-0JRhKd1mJclxFd56ei7rsarFld7xgg6DL5VtzBsHYBtKfuPmFRa0zA/exec`
- **Headers:**
```http
Content-Type: <application/x-www-form-urlencoded>
```
- **Body (raw → x-www-form-urlencoded):** 
```js
q : <văn_bản_tiếng_việt>
```


