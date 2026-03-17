import { useAuth } from "@clerk/expo";
import { Link } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

const Page = () => {
    const { signOut, isSignedIn } = useAuth();

    return (
        <View>
            <Button title="Log on" onPress={() => signOut()} />
            {!isSignedIn && (
                <Link href={"/(modals)/login"}>
                    <Text>Log in</Text>
                </Link>
            )}
        </View>
    );
};

export default Page;
