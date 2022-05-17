const GET_USERS = `
    select 
        user_id,
        user_name,
        user_contact,
        user_created_at
    from users
    where 
        (user_deleted_at is null) and
        (user_name ilike concat('%', $3::varchar, '%') or
        user_contact ilike concat('%', $3::varchar))
    order by
    case 
        when $4 = 'byDate' and $5 = 1 then user_created_at
    end asc,
    case 
        when $4 = 'byDate' and $5 = 2 then user_created_at
    end desc,
    case 
        when $4 = 'byName' and $5 = 1 then user_name
    end desc,
    case 
        when $4 = 'byName' and $5 = 2 then user_name
    end asc
    offset $1 limit $2
`

const GET_USER = `
    select 
        user_id,
        user_name,
        user_contact,
        user_created_at
    from users
    where user_deleted_at is null and 
    user_id::varchar = $1
`

const ADD_USER = `
    insert into users (
        user_name,
        user_contact
    ) values ($1, $2)
    returning *
`

const CHANGE_USER = `
    update users u set
        user_name = (
            case
                when length($2) > 0 then $2
                else u.user_name
            end
        ),
        user_contact = (
            case
                when length($3) > 0 then $3
                else u.user_contact
            end
        )
    where user_deleted_at is null and user_id::varchar = $1
    returning *
`

const DELETE_USER = `
    update users set
        user_deleted_at = current_timestamp
    where user_deleted_at is null and
    user_id::varchar = $1
    returning *
`

export default {
    DELETE_USER,
    CHANGE_USER,
    GET_USERS,
    GET_USER,
    ADD_USER
}