import { FindModel } from './find-model';

describe('FindModel', () => {

  let findModel: FindModel;

  beforeEach(() => {
    findModel = new FindModel('userName=fleetwoodmac', 'field1, field2', ' lastName ,asc , firstName ,desc , name ,asc ',10, 100, 'name', 'age' );
  });

  it('sort map should return a list of tokens with sortField and direction without training or preceding spaces', () => {
    const tokens = findModel.sortMap();
    expect(tokens).toEqual(['lastName','asc','firstName','desc', 'name', 'asc']);
  });

  it('removing a sort at last index should remove the sort field and direction and leave remaining start sorts and direction', () => {
    const sortMap = findModel.sortMap();
    const tokens = findModel.removeSort(4, sortMap);
    expect(tokens).toEqual(['lastName','asc','firstName','desc']);
  });

  // tslint:disable-next-line:max-line-length
  it('removing a sort at first index should remove the sort field and direction and index 0 and leave remaining sorts and direction', () => {
    const tokens = findModel.removeSort(0, findModel.sortMap());
    expect(tokens).toEqual(['firstName','desc', 'name', 'asc']);
  });

  it('removing a sort at middle index should remove the sort field and direction and index and leave remaining sorts and direction from beginning and end', () => {
    const tokens = findModel.removeSort(2, findModel.sortMap());
    expect(tokens).toEqual(['lastName','asc', 'name', 'asc']);
  });

  it('replace sort at index should replace the contents for ths sort correctly', () => {
    const tokens = findModel.replaceSort(2, 'asc', findModel.sortMap());
    expect(tokens).toEqual(['lastName','asc','firstName','asc', 'name', 'asc']);
  });

  it('regenerate sort with empty order (desc, ass) should return empty sort string', () => {
    findModel.sort = '';
    findModel.regeneratorSort('firstName', '');
    const tokens = findModel.sortMap();
    expect(tokens).toEqual([]);
  });

  it('regenerate sort with empty order (desc, ass) should return remove matching sort field name from results', () => {
    findModel.regeneratorSort("lastName", "");
    let tokens = findModel.sortMap();
    expect(tokens).toEqual(['firstName','desc', 'name', 'asc']);
    findModel.regeneratorSort('name', '');
    tokens = findModel.sortMap();
    expect(tokens).toEqual(['firstName','desc']);
    findModel.regeneratorSort('firstName', '');
    tokens = findModel.sortMap();
    expect(tokens).toEqual([]);
  });

  it('regenerate sort with existing item should replace item', () => {
    findModel.regeneratorSort("lastName", 'desc');
    let tokens = findModel.sortMap();
    expect(tokens).toEqual(['lastName','desc','firstName','desc', 'name', 'asc']);
    findModel.regeneratorSort("lastName", 'desc');
    tokens = findModel.sortMap();
    expect(tokens).toEqual(['lastName','desc','firstName','desc', 'name', 'asc']);
    findModel.regeneratorSort("name", 'desc');
    tokens = findModel.sortMap();
    expect(tokens).toEqual(['lastName','desc','firstName','desc', 'name', 'desc']);
  });

  it('regenerate sort with new item should and sort item to the end of the sorts', () => {
    findModel.regeneratorSort('dateCreated ', 'desc');
    const tokens = findModel.sortMap();
    expect(tokens).toEqual(['lastName','asc','firstName','desc', 'name', 'asc', 'dateCreated', 'desc']);
  });
});
