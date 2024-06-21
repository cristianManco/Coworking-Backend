# import {
#   Injectable,
#   NotFoundException,
#   BadRequestException,
#   HttpException,
#   HttpStatus,
# } from '@nestjs/common';
# import { InjectModel } from '@nestjs/mongoose';
# import { Model } from 'mongoose';
# import { User, UserDocument } from '../entities/user/user.entity';
# import * as admin from 'firebase-admin';
# import { v4 as uuidv4 } from 'uuid';
# import { JwtService } from '@nestjs/jwt';
# import {
#   Whitelist,
#   WhitelistDocument,
# } from '../entities/white-list/whiteList.entity';
# import { CreateUserDto, UpdateUserDto, UpdateRoleDto } from '../dtos/exportDTO';
# import { JwtPayload } from 'src/lib/interfaces/jwtPayload.interface';
# import { Tokens } from 'src/lib/interfaces/token.type';
# import { UserType } from 'src/lib/Enums/roles.enum';

# @Injectable()
# export class UsersService {
#   constructor(
#     @InjectModel(User.name) private userModel: Model<UserDocument>,
#     @InjectModel(Whitelist.name)
#     private whitelistModel: Model<WhitelistDocument>,
#     private jwtService: JwtService,
#   ) {}

#   async register(createUserDto: CreateUserDto): Promise<string> {
#     try {
#       const { token, termsVersion, metadataTerms, role, ...userData } =
#         createUserDto;
#       const decodedToken = await admin.auth().verifyIdToken(token);
#       const userRecord = await admin.auth().getUser(decodedToken.uid);

#       let user = await this.userModel.findOne({ email: userRecord.email });
#       if (user) throw new BadRequestException('User already exists! Try again');

#       user = new this.userModel({
#         id: uuidv4(),
#         firebaseId: userRecord.uid,
#         email: userRecord.email,
#         accessMethod: userRecord.providerData[0].providerId,
#         metadata: JSON.stringify(userRecord.metadata),
#         termsVersion,
#         metadataTerms,
#         ...userData,
#         createdAt: new Date(),
#         role: role,
#       });

#       await user.save();

#       const jwtPayload: JwtPayload = {
#         sub: user.id,
#         email: user.email,
#         role: user.role,
#       };
#       const accessToken = this.jwtService.sign(jwtPayload);

#       await this.whitelistJwt(accessToken);

#       return accessToken;
#     } catch (error) {
#       throw new HttpException(
#         `Failed to register user: ${error.message}`,
#         HttpStatus.INTERNAL_SERVER_ERROR,
#       );
#     }
#   }

#   async whitelistJwt(token: string): Promise<void> {
#     try {
#       const whitelistEntry = await new this.whitelistModel({ token });
#       await whitelistEntry.save();
#     } catch (error) {
#       throw new HttpException(
#         'Failed to whitelist token',
#         HttpStatus.INTERNAL_SERVER_ERROR,
#       );
#     }
#   }

#   async registerUserFirebase(signUpDto: CreateUserDto): Promise<Tokens> {
#     const { email, password, ...rest } = signUpDto;
#     await this.validateEmailForSignUp(email);

#     try {
#       const userRecord = await admin.auth().createUser({
#         email,
#         password,
#         // Add any additional fields as needed
#       });

#       const user = await new this.userModel({
#         ...rest,
#         email,
#         firebaseUid: userRecord.uid,
#       });

#       await user.save();

#       const tokens = await this.getTokens({
#         sub: user.id,
#         email: user.email,
#         role: user.role,
#       });

#       await this.whitelistJwt(tokens.access_token);

#       return await tokens;
#     } catch (error) {
#       throw new HttpException(
#         'Failed to register user',
#         HttpStatus.INTERNAL_SERVER_ERROR,
#       );
#     }
#   }

#   async validateEmailForSignUp(email: string): Promise<void> {
#     try {
#       const user = await this.userModel.findOne({ email });
#       if (user) {
#         throw new BadRequestException('Email already exists! Try again');
#       }
#     } catch (error) {
#       throw new HttpException(
#         'Failed to validate email! try again later with another email',
#         HttpStatus.INTERNAL_SERVER_ERROR,
#       );
#     }
#   }

#   async getTokens(jwtPayload: JwtPayload): Promise<Tokens> {
#     try {
#       const secretKey = process.env.JWT_SECRET;
#       if (!secretKey) {
#         throw new Error('JWT_SECRET is not set or is invalid');
#       }
#       const accessTokenOptions = {
#         expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '1h',
#       };

#       const accessToken = await this.signToken(
#         jwtPayload,
#         secretKey,
#         accessTokenOptions,
#       );

#       return { access_token: accessToken };
#     } catch (error) {
#       throw new HttpException(
#         'Failed to generate tokens',
#         HttpStatus.INTERNAL_SERVER_ERROR,
#       );
#     }
#   }

#   async signToken(payload: JwtPayload, secretKey: string, options: any) {
#     try {
#       return await this.jwtService.signAsync(payload, {
#         secret: secretKey,
#         ...options,
#       });
#     } catch (error) {
#       throw new HttpException(
#         'Failed to sign token',
#         HttpStatus.INTERNAL_SERVER_ERROR,
#       );
#     }
#   }

#   async updateUser(
#     userId: string,
#     updateUserDto: UpdateUserDto,
#   ): Promise<User> {
#     try {
#       const user = await this.userModel.findById(userId);
#       if (!user) throw new NotFoundException('User not found');

#       Object.assign(user, updateUserDto, { updatedAt: new Date() });
#       await user.save();

#       await admin.auth().updateUser(userId, {
#         email: updateUserDto.email,
#         displayName: updateUserDto.name,
#       });

#       return user;
#     } catch (error) {
#       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
#     }
#   }

#   async updateRole(
#     userId: string,
#     updateRoleDto: UpdateRoleDto,
#   ): Promise<User> {
#     try {
#       const user = await this.userModel.findById(userId);
#       if (!user) throw new NotFoundException('User not found');

#       user.role = updateRoleDto.role as UserType;
#       await user.save();

#       return user;
#     } catch (error) {
#       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
#     }
#   }

#   async deleteUser(userId: string, deletedBy: string): Promise<void> {
#     try {
#       const user = await this.userModel.findById(userId);
#       if (!user) throw new NotFoundException('User not found');

#       user.deletedAt = new Date();
#       user.deletedBy = deletedBy;
#       await user.save();

#       await admin.auth().deleteUser(userId);
#     } catch (error) {
#       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
#     }
#   }

#   async findAllUsers(
#     filters: any,
#     sort: string,
#     page: number = 1,
#     limit: number = 10,
#   ): Promise<any> {
#     try {
#       const query = { deletedAt: null }; // Exclude soft-deleted users

#       if (filters.name) query['name'] = { $regex: filters.name, $options: 'i' };
#       if (filters.email)
#         query['email'] = { $regex: filters.email, $options: 'i' };

#       const sortOption = sort === 'asc' ? 'createdAt' : '-createdAt';

#       const users = await this.userModel
#         .find(query)
#         .sort(sortOption)
#         .skip((page - 1) * limit)
#         .limit(limit)
#         .exec();

#       const total = await this.userModel.countDocuments(query).exec();

#       return { users, total, page, limit };
#     } catch (error) {
#       throw new HttpException(
#         'Failed to find users',
#         HttpStatus.INTERNAL_SERVER_ERROR,
#       );
#     }
#   }

#   async findOneByEmail(email: string): Promise<User> {
#     try {
#       const user = await this.userModel.findOne({ email });
#       if (!user) throw new NotFoundException('User not found');
#       return user;
#     } catch (error) {
#       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
#     }
#   }

#   async findOne(id: string): Promise<User> {
#     try {
#       const user = await this.userModel.findById(id);
#       if (!user) throw new NotFoundException('User not found');
#       return user;
#     } catch (error) {
#       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
#     }
#   }
# }


#* controller

#  @Public()
#   @Post('sign-up')
#   @ApiOperation({ summary: 'Register a new user by email and password' })
#   @ApiBody({
#     description: 'User data for registration with email and password',
#     type: CreateUserDto,
#     examples: {
#       user: {
#         summary: 'An example of a user registration by email and password',
#         value: {
#           role: 'adyttryadsvvatdauasdfaf',
#           name: 'Jane Doe',
#           email: 'jane@example.com',
#           password: 'strongpassword',
#           accessMethod: 'email',
#           metadata: 'Some metadata',
#           documentUser: '987654321',
#           typeDocument: 'id_card',
#           termsVersion: '1.0',
#           metadataTerms: '1.0',
#         },
#       },
#     },
#   })
#   @ApiResponse({
#     status: 201,
#     description: 'The user has been successfully created.',
#   })
#   @ApiResponse({ status: 400, description: 'Bad Request.' })
#   async registerByEmailPassword(@Body() signUpDto: CreateUserDto) {
#     return this.usersService.registerUserFirebase(signUpDto);
#   }








