import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';

@Controller('users')
export class UsersController {

    // Get AllUsersData
    @Get('fetch')
    getAllUsers() {
        return [{
            username: 'Muhammad Shaban',
            email: 'shaban.mughal1056@gmail.com',
            age: 20
        }];
    }


    // Get UsersPostComments data
    // @Get('posts/comments')
    // getUsersPostsComments() {
    //     return [{
    //         postComment_id: '0001',
    //         PostComment_name: 'Miya Jamal Khan',
    //         PostComment_likes: '10M'
    //     }];
    // }


    // Get UsersPosts data
    // @Get('posts')
    // getPostsUser() {
    //     return [{
    //         name: 'Muhammad Shanban',
    //         email: 'shaban.mughal1056@gmail.com',
    //         age: 25,

    //         posts: [
    //             { post_id: 1, account: 'Facebook', likes: '1k' },
    //             { post_id: 2, account: 'Instagram', likes: '10k' },
    //             { post_id: 1, account: 'LinkedIn', likes: '100k' }
    //         ]
    //     }];
    // }


    // Get Users data using @query() decorator
    // @Get()
    // getUsers(@Query('sortBy') sortBy: string) {
    //     console.log(sortBy);
    //     return [{ username: 'Muhammad shaban', email: 'shaban@gmail.com' }];
    // }


    // Get UserById using Route Parameter @param()
    // @Get(':id/:post_id')
    // getUserById(@Param('id') id: string, @Param('post_id') post_id: string) {
    //     console.log('Id is: ', id, 'Post_id is: ', post_id);
    //     return { id, post_id };
    // }


    // Post UserData using @Body() decorator with DTO
    @Post('newUser')
    @UsePipes(new ValidationPipe())
    createUser(@Body() userData: CreateUserDto) {
        console.log('Data of newly created user is: ', userData);
        return { userData };
    }


    // Post NewUser by @Req() and @Res() decorator
    //     @Post('newUser')
    //     postNewUser(@Req() request: Request, @Res() response: Response) {
    //         console.log('Data of newly created user is: ', request.body);
    //         return response.send(request.body);

    //     }




    @Get()
    getUserDetails(@Query('sortBy') sortBy: string) {
        console.log(sortBy);
        return { sortBy };
    }


    @Get(':id/:post_id')
    getUserById(@Param('id', ParseIntPipe) id: number, @Param('post_id', ParseIntPipe) post_id: number) {
        console.log('User id is: ', id, 'The post_id of a user is: ', post_id);
        return { id, post_id };
    }


    // @Post('newUser') 
    // createUser(@Body()userData: CreateUserDto) {
    //     console.log('Data of newly created user is: ', userData);
    //     return {userData};
    // }


    @Post()
    postNewUser(@Req() request: Request, @Res() response: Response) {
        console.log('Data of newly created user is: ', request.body);
        return response.send(
            request.body);
    }


    // @Delete(':id')
    // removeUserById( @remove('id') id: string ) {
    //     console.log('Deleted user id is: ', id);
    //     return { id };
    // }

}
