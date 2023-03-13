class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryStrCopy = { ...this.queryStr };
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((field) => delete queryStrCopy[field]);
    const querySt = JSON.stringify(queryStrCopy);
    const queryStrs = querySt.replace(
      /\b(gt|gte|lt|lte)/g,
      (match) => `$${match}`
    );
    this.query.find(JSON.parse(queryStrs));
    return this;
  }
  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerpage * (currentPage - 1);
    this.query.limit(resPerPage).skip(skip);
    return this;
  }
}
module.exports = APIFeatures;
