import { ListQueryDto2 } from "src/commons/dtos/list-query.dto";


export class ListCommentDto extends ListQueryDto2 {
    public articleId: number;
}

export class ListSubCommentDto extends ListQueryDto2 {
    public parentId: number;
}
